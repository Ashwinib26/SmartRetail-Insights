import requests
import streamlit as st
import pandas as pd
import altair as alt

# Page config
st.set_page_config(page_title="📊 CSV Data Visualizer", layout="wide")

# Custom CSS for better visuals
st.markdown("""
    <style>
    body {
        font-family: 'Segoe UI', sans-serif;
        background-color: #f8f9fa;
    }
    .main {
        background-color: #ffffff;
        border-radius: 12px;
        padding: 2rem;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
        margin-top: 1rem;
    }
    .css-18e3th9 {
        padding: 2rem;
    }
    </style>
""", unsafe_allow_html=True)

st.title("📈 Interactive CSV Dashboard")
st.markdown("Upload your dataset below and explore different visualizations easily.")

# === Flask API Integration Section ===
st.sidebar.markdown("### 🔄 Fetch Inventory from Flask API")
if st.sidebar.button("Fetch Inventory"):
    try:
        # You can pass cookies if needed using requests.Session() for authenticated APIs
        r = requests.get("http://localhost:5000/api/inventory")
        if r.status_code == 200:
            st.success("✅ Inventory data fetched successfully!")
            inventory_data = r.json()
            st.markdown("### 🧮 Inventory from Flask API")
            st.dataframe(pd.DataFrame(inventory_data))
        else:
            st.error(f"❌ Failed to fetch inventory. Status code: {r.status_code}")
    except Exception as e:
        st.error(f"🔌 Error connecting to Flask API: {e}")

# === File Upload and Visualization ===
st.sidebar.header("📂 Upload & Configuration")
uploaded_file = st.sidebar.file_uploader("Upload CSV", type=["csv"])
chart_type = st.sidebar.selectbox("📊 Choose Chart Type", ["Scatter", "Line", "Bar", "Histogram", "Box"])

if uploaded_file:
    df = pd.read_csv(uploaded_file)
    df.columns = df.columns.astype(str)
    st.markdown("## 🧾 Data Preview")
    st.dataframe(df, use_container_width=True)

    numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()

    if len(numeric_cols) >= 1:
        st.markdown("## 🎯 Chart Configuration")
        col1, col2 = st.columns(2)

        with col1:
            x_axis = st.selectbox("Select X-axis", numeric_cols)

        with col2:
            y_axis = None
            if chart_type != "Histogram":
                y_axis = st.selectbox("Select Y-axis", numeric_cols, index=1)

        try:
            if chart_type == "Scatter":
                chart = alt.Chart(df).mark_circle(size=60).encode(
                    x=f"{x_axis}:Q", y=f"{y_axis}:Q", tooltip=list(df.columns)
                ).interactive()

            elif chart_type == "Line":
                chart = alt.Chart(df).mark_line().encode(
                    x=f"{x_axis}:Q", y=f"{y_axis}:Q", tooltip=list(df.columns)
                ).interactive()

            elif chart_type == "Bar":
                chart = alt.Chart(df).mark_bar().encode(
                    x=f"{x_axis}:Q", y=f"{y_axis}:Q", tooltip=list(df.columns)
                ).interactive()

            elif chart_type == "Histogram":
                chart = alt.Chart(df).mark_bar().encode(
                    alt.X(f"{x_axis}:Q", bin=True), y='count()', tooltip=[x_axis]
                ).interactive()

            elif chart_type == "Box":
                chart = alt.Chart(df).mark_boxplot().encode(
                    x=f"{x_axis}:Q", y=f"{y_axis}:Q" if y_axis else f"{x_axis}:Q", tooltip=list(df.columns)
                ).interactive()

            st.markdown("## 📊 Chart Preview")
            st.altair_chart(chart, use_container_width=True)

        except Exception as e:
            st.error(f"❌ Failed to generate chart: {e}")
    else:
        st.warning("CSV must contain at least one numeric column for visualization.")
else:
    st.info("👈 Please upload a CSV file to get started.")
