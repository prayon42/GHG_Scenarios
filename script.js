function populateSelectors() {
    const populations = [...new Set(emissionData.map(d => d.population))].sort((a, b) => a - b);
    const frequencies = [...new Set(emissionData.map(d => d.frequency))].sort((a, b) => a - b);
  
    const popSelect = document.getElementById("populationSelect");
    const freqSelect = document.getElementById("frequencySelect");
  
    populations.forEach(p => {
      const option = document.createElement("option");
      option.value = p;
      option.textContent = p;
      popSelect.appendChild(option);
    });
  
    frequencies.forEach(f => {
      const option = document.createElement("option");
      option.value = f;
      option.textContent = f;
      freqSelect.appendChild(option);
    });
  }
  
  function calculate() {
    const pop = Number(document.getElementById("populationSelect").value);
    const freq = Number(document.getElementById("frequencySelect").value);
    const cap = Number(document.getElementById("captureSelect").value);
  
    const match = emissionData.find(
      d => d.population === pop && d.frequency === freq && d.capture === cap
    );
  
    if (!match) {
      document.getElementById("output").innerHTML = "No data for selected scenario.";
      return;
    }
    const isReduction = match.reduction < 0;
    const red = match.reduction * 1_000_000; // Convert Gg to kg
    const resultLines = [
        `<strong>Total Methane Emissions:</strong> ${match.total} Gg`
      ];
      
      let emissionClass = "emission-neutral";
      let emissionText = "No Change in Emission";
      
      if (match.reduction < 0) {
        emissionClass = "emission-reduction";
        emissionText = `Emission Reduction: ${Math.abs(match.reduction)} Gg CO₂e`;
      } else if (match.reduction > 0) {
        emissionClass = "emission-addition";
        emissionText = `Emission Addition: ${match.reduction} Gg CO₂e`;
      }
      
      resultLines.push(`<div class="${emissionClass}">${emissionText}</div>`);
      
    resultLines.push(`<br><strong>Equivalent to:</strong><ul>`);  
    const activityLabels = {
      "Petrol car (per km)": { label: "driven by petrol car", icon: "🚗", unit: "km" },
      "LPG cylinder (14.2 kg)": { label: "used", icon: "🛢️", unit: "LPG cylinders" },
      "Flight (Kathmandu–London)": { label: "round trips KTM–London", icon: "✈️", unit: "flights" },
      "Firewood (per kg)": { label: "of firewood burned", icon: "🔥", unit: "kg" },
      "Household electricity (annual, kWh)": { label: "household electricity", icon: "💡", unit: "kWh" },
      "City bus (per km per passenger)": { label: "travelled on city bus", icon: "🚌", unit: "km" },
      "Arctic Ice (per sq. m.)": { label: "arctic ice", icon: "❄️", unit: "sq. m." }
      
    };
  
    const equivalents = Object.entries(emissionFactors).map(([activity, factor]) => {
      const amount = red / factor;
      return {
        activity,
        value: amount,
        formatted: amount.toLocaleString(undefined, { maximumFractionDigits: 0 }),
        ...activityLabels[activity]
      };
    });
  
    equivalents.sort((a, b) => b.value - a.value); // Sort by biggest to smallest impact
  
    equivalents.forEach(eq => {
      resultLines.push(
        `<li title="${eq.label}">${eq.icon} ${eq.formatted} ${eq.unit} ${eq.label}</li>`
      );
    });
  
    resultLines.push("</ul>");
    document.getElementById("output").innerHTML = resultLines.join("\n");
    

  }
  
  window.onload = populateSelectors;
  