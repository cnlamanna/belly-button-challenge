// Define the URL for the JSON data
const jsonURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

let data; // Define data variable in a scope accessible to all functions

// Function to create the horizontal bar chart
function createBarChart(selectedData) {
  // Sort the data by sample_values
  const sortedData = selectedData.sample_values.slice(0, 10).sort((a, b) => b - a);

  // Create the horizontal bar chart trace
  const trace = {
    x: sortedData,
    y: selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`),
    text: selectedData.otu_labels.slice(0, 10),
    type: "bar",
    orientation: "h",
  };

  const layout = {
    title: "Top 10 OTUs Found",
    xaxis: { title: "Sample Values" },
  };

  Plotly.newPlot("bar", [trace], layout);
}

// Function to create the bubble chart
function createBubbleChart(selectedData) {
  const trace = {
    x: selectedData.otu_ids,
    y: selectedData.sample_values,
    text: selectedData.otu_labels,
    mode: 'markers',
    marker: {
      size: selectedData.sample_values,
      color: selectedData.otu_ids,
      colorscale: 'Earth',
    }
  };

  const layout = {
    title: 'OTU Bubble Chart',
    xaxis: { title: 'OTU ID' },
    yaxis: { title: 'Sample Values' },
  };

  Plotly.newPlot('bubble', [trace], layout);
}

// Function to find and return the metadata for the selected individual
function getMetadataForSelectedIndividual(selectedId) {
  return data.metadata.find(entry => entry.id == selectedId);
}

// Function to update the demographic information
function updateDemographicInfo(metadata) {
  const demographicInfo = d3.select("#sample-metadata");
  demographicInfo.html("");

  Object.entries(metadata).forEach(([key, value]) => {
    demographicInfo.append("p").text(`${key}: ${value}`);
  });
}

// Use D3.js to fetch the JSON data
d3.json(jsonURL)
  .then(responseData => {
    console.log(responseData);
    data = responseData; 

    // Populate the dropdown menu with individual IDs
    const dropdown = d3.select("#selDataset");

    // dropdown for individual IDs
    data.names.forEach(id => {
      dropdown.append("option").text(id).property("value", id);
    });

    // Initialize the chart with the first individual (or any default selection)
    const initialId = data.names[0];
    optionChanged(initialId);
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });

// Function to update the chart based on the selected individual
function optionChanged(selectedId) {
  const selectedData = data.samples.find(entry => entry.id == selectedId);

  createBarChart(selectedData);
  createBubbleChart(selectedData);

  // Retrieve the metadata for the selected individual
  const metadata = getMetadataForSelectedIndividual(selectedId);

  // Update the demographic information
  updateDemographicInfo(metadata);
}
