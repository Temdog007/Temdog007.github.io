const storageKey = "g-arch";

const architecture = JSON.parse(localStorage.getItem(storageKey)) || {
    components : [],
    entities : [],
    systems : [],
    families : []
};

const typeOptions = [
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
            new Property()
        ];
    }
}

class Property 
{
    constructor(name, type, isArray)
    {
        this.name = name || 'property';
        this.type = type || 'int';
        this.isArray = isArray || false;
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
    if(!evt.target)
    {
        return;
    }

    const comp = evt.target.component;
    if(!comp)
    {
        return;
    }

    const t = $(evt.target);

    switch(t.attr('target'))
    {
        case 'component-name':
            comp.name = t.val();
            break;
        case 'property-name':
            comp.properties[t.attr('index')].name = t.val();
            break;
        case 'property-type':
            comp.properties[t.attr('index')].type = t.val();
            break;
        case 'property-array':
            comp.properties[t.attr('index')].isArray = t.prop("checked");
            break;
        default:
            return;
    }
    
    updateComponentsModel();
}

function addProperty(evt)
{
    const t = evt.target;
    if(t !== this)
    {
        return;
    }

    if(!t.component)
    {
        return;
    }

    t.component.properties.push(new Property());
    updateComponentsModel();
}

function deleteProperty(evt)
{
    const t = evt.target;
    if(t !== this)
    {
        return;
    }

    if(!t.component)
    {
        return;
    }

    const index = $(t).attr("index");
    const prop = t.component.properties[index];
    if(!prop)
    {
        return;
    }

    if(!confirm(`Are you sure you want to delete the '${prop.name}' property?`))
    {
        return;
    }

    t.component.properties.splice(index, 1);
    updateComponentsModel();
}

function deleteComponent(evt)
{
    const t = evt.target;
    if(!t)
    {
        return;
    }

    if(!t.component)
    {
        return;
    }

    if(!confirm(`Are you sure you want to delete the '${t.component.name}' component?`))
    {
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

    for(const comp of architecture.components)
    {
        const compDiv = document.createElement("div");
        compDiv.setAttribute("class", "component-div p-2");
        div.appendChild(compDiv);

        const topRow = document.createElement("div");
        topRow.setAttribute("class", "row");
        compDiv.appendChild(topRow);

        const input = document.createElement("input");
        input.setAttribute("class", "col entity-name-text");
        input.setAttribute("type", "text");
        input.setAttribute("target", "component-name");
        input.component = comp;
        input.value = comp.name;
        topRow.appendChild(input);

        const properties = comp.properties;
        for(let i = 0; i < properties.length; ++i)
        {
            const prop = properties[i];

            const table = document.createElement("div");
            table.setAttribute("class", "row");
            compDiv.appendChild(table);

            const key = document.createElement("input");
            key.setAttribute("type", "text");
            key.setAttribute("index", i);
            key.setAttribute("target", "property-name");
            key.setAttribute("class", "col");
            key.component = comp;
            key.value = prop.name;
            table.appendChild(key);

            const d = document.createElement("div");
            d.setAttribute("class", "col-md-auto");
            table.appendChild(d);

            const label = document.createElement("label");
            label.setAttribute("for", `${prop.name}-checkbox`);
            label.innerHTML = "IsArray?";
            d.appendChild(label);

            const check = document.createElement("input");
            check.setAttribute("type", "checkbox");
            check.setAttribute("index", i);
            check.setAttribute("id", `${prop.name}-checkbox`);
            check.setAttribute("target", "property-array");
            check.setAttribute("class", "col-md-auto");
            check.component = comp;
            check.checked = prop.isArray;
            d.appendChild(check);

            const select = document.createElement("select");
            select.setAttribute("index", i);
            select.setAttribute("target", "property-type");
            select.setAttribute("class", "col-md-auto");
            select.component = comp;
            table.appendChild(select);

            for(const option of typeOptions)
            {
                const o = document.createElement("option");
                o.innerHTML = option;
                select.appendChild(o);
            }

            select.value = prop.type;

            const del = document.createElement("button");
            del.setAttribute("class", "col-md-auto btn-warning btn");
            del.setAttribute("type", "button");
            del.setAttribute("index", i);
            del.component = comp;
            $(del).click(deleteProperty);
            del.innerHTML = "X";
            table.appendChild(del);
        }

        $('input', $(compDiv)).each((_, t) =>  $(t).change(updateComponentInput));
        $('select', $(compDiv)).each((_, t) =>  $(t).change(updateComponentInput));

        const bottomRow = document.createElement("div");
        bottomRow.setAttribute("class", "row");
        compDiv.appendChild(bottomRow);

        const add = document.createElement("button");
        add.setAttribute("class", "col btn-success btn");
        add.setAttribute("type", "button");
        add.component = comp;
        $(add).click(addProperty);
        add.innerHTML = "Add Property";
        bottomRow.appendChild(add);

        const del = document.createElement("button");
        del.setAttribute("class", "col btn-danger btn");
        del.setAttribute("type", "button");
        del.component = comp;
        $(del).click(deleteComponent);
        del.innerHTML = "Delete Component";
        bottomRow.appendChild(del);
    }
    
    save();
}

function save()
{
    var str = JSON.stringify(architecture, undefined, 2);
    localStorage.setItem(storageKey, str);
    $("#json-content").html(str);
}