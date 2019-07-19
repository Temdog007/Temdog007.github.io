const storageKey = "g-arch";

var architecture = JSON.parse(localStorage.getItem(storageKey)) || {
    components : [],
    entities : [],
    systems : [],
    families : []
};

class Component
{
    constructor(name)
    {
        if(typeof name != "string" || !name)
        {
            throw new Error("Must enter a name");
        }
        this.name = name;
        this.properties = [
            {
                name : 'x',
                type : 'integer'
            }
        ];
    }
}

updateComponentsModel();
updateJson();

$("#systems-button").click(() => 
{
    
});

$("#components-button").click(() =>
{
    const component = new Component(`New Component${architecture.components.length}`);
    architecture.components.push(component);

    updateComponentsModel();
});

$("#entities-button").click(() =>
{

});

$("#families-button").click(() =>
{

});

function updateComponentInput(evt)
{
    var t = evt.target;
    var comp = architecture.components.find(c => c.name == $(t).attr('component-name'));
    if(!comp)
    {
        return;
    }

    switch($(t).attr('target'))
    {
        case 'name':
            comp.name = $(t).val();
            break;
        case 'property-name':
            comp.properties[$(t).attr('index')].name = $(t).val();
            break;
        case 'property-type':
            comp.properties[$(t).attr('index')].type = $(t).val();
            break;
        default:
            return;
    }
    
    updateComponentsModel();
}

function updateJson()
{
    $("#jsonContent").html(JSON.stringify(architecture, undefined, 2));
}

function updateComponentsModel()
{
    const div = document.getElementById("components-data");
    while(div.hasChildNodes())
    {
        div.lastChild.remove();
    }

    for(var comp of architecture.components)
    {
        var compDiv = document.createElement("div");

        var h = document.createElement('h5');
        h.innerHTML = `<input type='text' value='${comp.name}' component-name='${comp.name}' target='name' onclick='${updateComponentInput}'>`;
        compDiv.appendChild(h);

        var table = document.createElement("table");
        compDiv.appendChild(table);

        table.innerHTML +=`
            <table class='table table-strpied'>
                <tr>
                    <th>Key</th>
                    <th>Type</th>
                </tr>
        `;

        const properties = comp.properties;
        for(var i = 0; i < properties.length; ++i)
        {
            var prop = properties[i];
            table.innerHTML += `
            <tr>
                <td><input type='text' value='${prop.name}' component-name='${comp.name}' target='property-name' index='${i}'></td>
                <td>${prop.type}</td>
            </tr>
            `;
        }
        
        div.appendChild(compDiv);

        $('input', $(table)).each((_, t) =>  $(t).change(updateComponentInput));
    }
    
    save();
}

function save()
{
    localStorage.setItem(storageKey, JSON.stringify(architecture));
    updateJson();
}