const storageKey = "g-arch";

var architecture = JSON.parse(localStorage.getItem(storageKey)) || {
    components : [],
    entities : [],
    systems : [],
    families : []
};

var typeOptions = [
    'char',
    'byte',
    'short',
    'ushort',
    'int',
    'uint',
    'long',
    'ulong',
    'float',
    'double',
    'string',
];

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

function deleteComponent(evt)
{
    var t = evt.target;
    if(!t)
    {
        console.log(t);
        return;
    }

    if(!t.component)
    {
        console.log(t);
        return;
    }

    architecture.components.splice(architecture.components.indexOf(t.component), 1);
    updateComponentsModel();
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
        compDiv.setAttribute("class", "component-div p-2");
        div.appendChild(compDiv);

        var topRow = document.createElement("div");
        topRow.setAttribute("class", "row");

        var input = document.createElement("input");
        input.setAttribute("class", "col");
        input.setAttribute("type", "text");
        input.setAttribute("target", "name");
        input.value = comp.name;
        topRow.appendChild(input);

        var del = document.createElement("button");
        del.setAttribute("class", "col btn-danger btn");
        del.setAttribute("type", "button");
        del.component = comp;
        $(del).click(deleteComponent);
        del.innerHTML = "Delete";
        topRow.appendChild(del);

        compDiv.appendChild(topRow);

        var table = document.createElement("div");
        table.setAttribute("class", "row");
        compDiv.appendChild(table);

        const properties = comp.properties;
        for(var i = 0; i < properties.length; ++i)
        {
            var prop = properties[i];
            var key = document.createElement("input");
            key.setAttribute("type", "text");
            key.setAttribute("index", i);
            key.setAttribute("target", "property-name");
            key.setAttribute("class", "col");
            key.value = prop.name;
            table.appendChild(key);

            var type = document.createElement("select");
            type.setAttribute("type", "text");
            type.setAttribute("index", i);
            type.setAttribute("target", "property-type");
            type.setAttribute("class", "col");
            type.value = prop.type;
            table.appendChild(type);

            for(var option of typeOptions)
            {
                var o = document.createElement("option");
                o.innerHTML = option;
                type.appendChild(o);
            }
        }

        $('input', $(table)).each((_, t) =>  $(t).change(updateComponentInput));
    }
    
    save();
}

function save()
{
    localStorage.setItem(storageKey, JSON.stringify(architecture));
}