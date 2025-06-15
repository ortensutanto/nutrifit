import pandas as pd
from sklearn.neighbors import NearestNeighbors
import sklearn
from flask import Flask, request, jsonify
import flask

print(pd.__version__)
print(sklearn.__version__)
print(flask.__version__)

# --- Model Loading and Training (do this once at startup) ---

# In a real app, you'd load this from your database
# samplereviews.csv seharusnya di update kalo modelnya offline, tapi gausah
df = pd.read_csv('samplereviews.csv') 

# Create the user-recipe rating matrix
R = df.pivot(index='user_id', columns='recipe_id', values='rating').fillna(0)

# Initialize and fit the KNN model
knn_model = NearestNeighbors(metric='cosine', algorithm='brute')
knn_model.fit(R)

print("✅ Model trained and ready.")

# --- Flask App ---
app = Flask(__name__)

@app.route('/recommend', methods=['POST'])
def recommend():
    # 1. Get the new user's reviews from the request body
    user_reviews = request.json.get('reviews') # e.g., {'recipe_id_A': 5, 'recipe_id_B': 4}
    if not user_reviews:
        return jsonify({"error": "Reviews not provided"}), 400

    # 2. Create a vector for the new user
    new_user_vector = pd.Series(index=R.columns, dtype='float64').fillna(0)
    new_user_vector.update(pd.Series(user_reviews))
    
    # 3. Find similar users
    distances, indices = knn_model.kneighbors(new_user_vector.values.reshape(1, -1), n_neighbors=11)
    
    similar_user_indices = indices.flatten()[1:]
    similar_user_ids = R.index[similar_user_indices]
    
    # 4. Generate recommendations
    similar_users_ratings = R.loc[similar_user_ids]
    recommendation_scores = similar_users_ratings.mean(axis=0)
    
    recipes_already_rated = user_reviews.keys()
    recommendation_scores = recommendation_scores.drop(labels=recipes_already_rated, errors='ignore')
    
    top_recommendations = recommendation_scores.sort_values(ascending=False).head(10)
    
    # 5. Return the list of recommended recipe IDs
    recommended_ids = top_recommendations.index.tolist()
    return jsonify({"recommended_recipe_ids": recommended_ids})

if __name__ == '__main__':
    # Run the Flask app on port 5001 to avoid conflicts with Node.js
    app.run(port=5001, debug=True)