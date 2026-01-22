🌍 ExoHabitAI
Predicting the Habitability of Exoplanets Using Machine Learning
ExoHabitAI is a full-stack Machine Learning web application that predicts the habitability of exoplanets based on their astrophysical parameters. 
The system uses a trained ML model, interactive visual dashboards, and has been successfully deployed on Render.

Project Working Demo Video:
(https://drive.google.com/file/d/1-6ODRyHLui1Epxpjxjg1XQtW6BAjO7O5/view?usp=sharing)

Project Overview
With the increasing discovery of exoplanets, analyzing their habitability manually is inefficient. 
ExoHabitAI automates this process by:
Accepting planetary parameters as input
Predicting a habitability score
Visualizing analytics through interactive dashboards
Allowing users to export prediction results

✨Features
Exoplanet Habitability Prediction
Dynamic Analytics Dashboard
Interactive Charts & Graphs
Export Results to Excel
Web-based UI
Deployed on Render

Tech Stack Used
Frontend
HTML5
CSS3
JavaScript
Bootstrap

Backend
Python
Flask (Web Framework)

Machine Learning
Scikit-learn
NumPy
Pandas

Visualization
Matplotlib (as used in project)

Deployment
Render (Cloud Platform)
GitHub (Version Control)

⚙️ Project Architecture
├── backend/
│   ├── app.py
│   ├── model/
│   ├── data/
│   └── outputs/
│
├── frontend/
│   ├── templates/
│   ├── static/
│   │   ├── css/
│   │   └── js/
│
├── requirements.txt
├── README.md
└── .gitignore

How the Project Works
User enters exoplanet parameters through the web interface
Backend validates and preprocesses input data
ML model predicts the habitability score
Prediction is stored and reflected in analytics
Dashboard dynamically updates graphs
User can export results as an Excel file

📊 Analytics Dashboard
Displays habitability score trends
Visualizes prediction distributions
Updates dynamically when new planets are predicted
Helps in comparative analysis of exoplanets

☁️ Deployment on Render
Deployment Steps Followed:
Project pushed to GitHub repository
Render Web Service created

Build command:
pip install -r requirements.txt

Start command:
python app.py

Environment configured for Python
Application successfully deployed and tested

🧾 Requirements
All dependencies are listed in requirements.txt, including:
flask
pandas
numpy
scikit-learn
joblib
matplotlib
seaborn
reportlab
openpyxl
gunicorn

📌Future Enhancements
Database integration for persistent storage
User authentication
Advanced analytics
Support for more astronomical datasets
Model performance optimization

👩‍💻 Author
Bhumika N
Computer Science Engineering
Machine Learning & Web Development Enthusiast

🙏 Acknowledgement
Special thanks to Springboard Mentor Team for guidance and support throughout the project development and deployment process.

⭐ If you like this project

Please ⭐ star the repository and share your feedback!
