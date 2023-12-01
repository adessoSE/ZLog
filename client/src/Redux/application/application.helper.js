export function prepareApplicationData(data) {
  let elements = JSON.parse(data).facets[0].elements;
  //console.log("array", arr);
  let applicationName = [];

  for (let i = 0; i < elements.length; i++) {
    applicationName.push(elements[i].value);
  }

  if (!applicationName.includes('Alle Systeme')) {
    applicationName.push('Alle Systeme');
  }
  return applicationName;
}
