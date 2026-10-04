# Nodex: Catching Server Crashes Before They Happen

Most cloud auto-scaling systems are purely reactive. They wait until a server's CPU hits 90%, users start experiencing lag, and alarms go off before they finally decide to spin up a backup server. By the time the new server is online, the damage is already done. 

I thought that was a bit backward. Why wait for the fire to start?

I built Nodex to see if I could predict server overloads before they actually happen. It's a predictive auto-scaling engine that uses machine learning to forecast a crash and trigger a scale-up sequence early.

### How it works
Instead of just setting a basic threshold (like "if CPU > 80, add server"), I trained a Random Forest model on thousands of rows of simulated server telemetry. The model learned the subtle warning signs of a crash—like what happens when network I/O starts spiking while memory is slowly filling up. 

I wrapped that AI brain in a FastAPI backend. Then, I built a real-time monitoring dashboard using React and Tailwind CSS. The dashboard sends live server metrics to the Python API, and the AI returns a prediction. If the predicted future load is dangerously high, the dashboard flashes an "Overload Imminent" warning and fires a trigger to automatically scale up the infrastructure.

<img width="1177" height="540" alt="dashboard png" src="https://github.com/user-attachments/assets/19bb9551-655e-4e88-b4c7-ffce6113d158" />


### The Stack
* **Backend:** Python, FastAPI, Pandas, Scikit-learn
* **Frontend:** React, Tailwind CSS v4, Axios, Vite
* **Machine Learning:** Random Forest Regressor

