async function loadFeatureImportance() { //function to load feature importance data
    const res=await fetch("/feature-importance");//fetching data from the endpoint
    const data=await res.json(); //parsing the response as json

    const features=data.feature_importance.map(f => f.feature); // .map means to extract specific property from array of objects
    const importance=data.feature_importance.map(f => f.importance); //extracting importance values
    

    const trace={
        x:importance,
        y:features,
        type:"bar",
        orientation:"h"
    }; //trace for horizontal bar chart

    const layout ={
        title:"Feature Importance for Habitability Prediction",
        xaxis:{ title: "Importance Score"},
        margin:{ l:120}
    }; //layout for the chart

    Plotly.newPlot("featureImportanceChart",[trace],layout); //rendering the chart in the div with id featureImportanceChart
    }
    loadFeatureImportance(); //calling the function to load feature importance on page load

    //explain what the entire code does
    //This code fetches feature importance data from the server and visualizes it as a horizontal bar chart using Plotly.js. 
    // It extracts feature names and their corresponding importance scores from the fetched data, creates a trace for the bar chart,
    //  defines the layout, and then renders the chart in a specified HTML element.
    //  The function is called immediately to display the chart when the page loads.

    async function loadScoreDistribution() {//function to load score distribution data
        const res=await fetch("/score-distribution"); //fetching data from the endpoint
        const data=await res.json(); //parsing the response as json

        const trace={
            x:data.scores,
            type:"histogram"
        };//trace for histogram

        const layout={
            title:"Habitability Score Distribution",
            xaxis:{title:"Habitability Probability"},
            yaxis:{title:"Number of Exoplanets"}
        };

        Plotly.newPlot("scoreDistributionChart",[trace],layout); //rendering the histogram in the div with id scoreDistributionChart in html
    }
    loadScoreDistribution(); //calling the function to load score distribution on page load

    //explain what the entire code does
    //This code fetches habitability score distribution data from the server and visualizes it as a histogram using Plotly.js.
    // It creates a trace for the histogram using the fetched scores, defines the layout with titles for the axes,
    // and then renders the histogram in a specified HTML element. The function is called immediately to display the histogram when the page loads.
    //why create trace variable
    //The trace variable is created to define the data and visual properties of the plot in a structured way.
    // In Plotly.js, a trace represents a single series of data to be plotted, along with its type (e.g., bar, scatter, histogram) and other attributes.
    // By creating a trace variable, you can easily customize and manage the data representation before passing it to the plotting function.
    // It helps in organizing the data and its visualization parameters, making the code cleaner and more maintainable.

    async function loadCorrelations() {
        const res =await fetch("/correlations");//fetching data from the endpoint
        const data=await res.json(); //parsing the response as json

        const trace={
            z:data.matrix,//2D array of correlation values
            //explain z variable and matrix variable
            //The z variable represents the 2D array of correlation values.
            //example: [[1.0,0.5,...],[0.5,1.0,...],...] where each inner list represents correlation values of a feature with all other features
            x:data.labels, //feature names for x-axis
            y:data.labels, //feature names for y-axis
            //example: ["radius","mass","temp",...]
            //example of y variable is same as x variable
            type:"heatmap"
        };//trace for heatmap

        const layout={
            title:"Star-Planet Correlation Heatmap"
        };//layout for the heatmap

        Plotly.newPlot("correlationHeatmap",[trace],layout); //rendering the heatmap in the div with id correlationHeatmap in html
    }

    loadCorrelations(); //calling the function to load correlations on page load

    //explain what the entire code does 
    //This code fetches correlation data from the server and visualizes it as a heatmap using Plotly.js. 
    // It creates a trace for the heatmap using the fetched correlation matrix and feature names, defines the layout with a title,
    // and then renders the heatmap in a specified HTML element. The function is called immediately to display the heatmap when the page loads.