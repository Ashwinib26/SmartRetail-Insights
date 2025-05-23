import pandas as pd

df = pd.read_csv('store.csv')

# df.fillna(0, inplace=True)
# df['Category'] = df['Category'].astype('category')

df.drop('Store',axis=1, inplace=True)

# Saved preprocessed data
df.to_csv('cleaned_data.csv', index=False)
