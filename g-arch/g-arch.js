const storageKey = "g-arch";

var architecture = JSON.parse(localStorage.getItem(storageKey)) || {
    components : [],
    entities : [],
    systems : [],
    families : []
};

updateComponentsModel();
updateJson();

$("#systems-button").click(() => 
{
    
});

$("#components-button").click(() =>
{
    var component = {
        name : `New Component${architecture.components.length}`
    };
    architecture.components.push(component);
    save();
    updateComponentsModel();
    updateJson();
});

$("#entities-button").click(() =>
{

});

$("#families-button").click(() =>
{

});

function updateJson()
{
    $("#jsonContent").html(JSON.stringify(architecture, undefined, 2));
}

function updateComponentsModel()
{
    var div = document.getElementById("components-data");
    while(div.hasChildNodes())
    {
        div.lastChild.remove();
    }

    for(var key in architecture.components)
    {
        var compDiv = document.createElement("div");
        var h = document.createElement("h5");

        var table = document.createElement("table");
        compDiv.appendChild(table);

        table.innerHTML +=`
            <table>
            <tr>
                <th>Key</th>
                <th>Type</th>
                <th>Value</th>
            </tr>
        `;

        var comp = architecture.components[key];
        for(var k in comp)
        {
            var val = comp[k];
            table.innerHTML += `
            <tr>
                <td>${k}</td>
                <td>${typeof val}</td>
                <td>${val}</td>
            </tr>
            `;
        }
        
        div.appendChild(table);
    }
}

function save()
{
    localStorage.setItem(storageKey, JSON.stringify(architecture));
}