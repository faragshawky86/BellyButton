function buildMetadata(sample) {


    let sample_metadata = d3.select("#sample-metadata")

   //Clear the form
    sample_metadata.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json("/metadata/"+ sample).then((data) => {
      
      Object.entries(data).forEach(function([key,value]){
        sample_metadata.append("p").text(key + ":" + value)
      });
    });

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json("/samples/" + sample).then((data) => {

    let otu_ids = data["otu_ids"];
    let otu_labels = data["otu_labels"];

    let bChart = {
      x: otu_ids,
      y: data.sample_values,
      mode: `markers`,
      text: otu_labels,
      marker: {
        color: otu_ids,
        size: data.sample_values
      }
    }
    let bData = [bChart];

    let bLayout ={
      height: 750,
      width: 750,
      xaxis: {
        title:"OTU Id"
      },
      yaxis: {
        title:"Samples"
      },
      title: "Linear Bubble Chart"
    }
    Plotly.newPlot("bubble", bData, bLayout)


    otu_ids_slice = otu_ids.slice(0, 10);
    otu_labels_slice = otu_labels.slice(0, 10);

    var pData = [{
      values: otu_ids_slice,
      labels: otu_labels_slice,
      type: "pie"
    }];

    var pLayout = {
      height: 450,
      width: 450,
      showlegend: true,
      legend: {
        "orientation": "v",
        "x": 1.02,
        "xanchor": "right",
        "y": 1.0,
        "yanchor": "bottom"
      },
      title: "Pie Chart"
    };
  
    Plotly.newPlot("pie", pData, pLayout);
  })


    // @TODO: Build a Bubble Chart using the sample data


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function selectionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
