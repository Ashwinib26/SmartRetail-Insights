import pandas as pd

df = pd.read_csv('store.csv')

# df.fillna(0, inplace=True)
# df['Category'] = df['Category'].astype('category')

print(df.size)
print("Missing values per column:\n")
print(df.isnull().sum())

df.dropna(subset=['CompetitionDistance'], inplace=True)
df.drop('Store',axis=1, inplace=True)

print("Missing values per column:\n")
print(df.isnull().sum())

# Saved preprocessed data
df.to_csv('cleaned_data.csv', index=False)
