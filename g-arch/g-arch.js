const storageKey = "g-arch";

const exampleArchitecture = {
    components : [
        {
            name : "position",
            properties: [
                {
                    name : "x",
                    type : "float"
                },
                {
                    name: "y",
                    type : "float"
                }
            ]
        },
        {
            name: "velocity",
            properties: [
                {
                    name : "x",
                    type : "float"
                },
                {
                    name : "y",
                    type : "float"
                }
            ]
        },
        {
            name : "controller",
            properties : [
                {
                    name : "controllerType",
                    type : "string"
                }
            ]
        },
        {
            name : "texture",
            properties : [
                {
                    name : "textureFilePath",
                    type : "string"
                }
            ]
        }
    ],
    families : [
        {
            name : "movable",
            components : [
                "position",
                "velocity"
            ]
        },
        {
            name : "drawable",
            components : [
                "position",
                "texture"
            ]
        },
        {
            name : "controllable",
            components : [
                "velocity",
                "controller"
            ]
        }
    ],
    entities : [
        {
            name : "player",
            families : [
                "movable",
                "drawable",
                "controlable"
            ]
        }
    ],
    systems : [
        {
            name : "movePlayer",
            parameters : [
                "movable"
            ]
        },
        {
            name : "drawPlayer",
            parameters : [
                "drawable"
            ]
        },
        {
            name : "controllerPlayer",
            parameters : [
                "controlable"
            ]
        }
    ]
};

const architecture = JSON.parse(localStorage.getItem(storageKey)) || exampleArchitecture;

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

update();

function update()
{
    updateComponentsModel();
    updateFamiliesModel();
}

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
    const family = {
        name : `New Family${architecture.families.length}`,
        components : []
    };
    architecture.families.push(family);

    updateFamiliesModel();
});

function updateInput(evt)
{
    if(!evt.target)
    {
        return;
    }

    const comp = evt.target.component;
    const family = evt.target.family;
    if(!comp && !family)
    {
        return;
    }

    const t = $(evt.target);

    switch(t.attr('target'))
    {
        case 'family-name':
            family.name = t.val();
            break;
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

function addComponentToFamily(evt)
{
    const t = evt.target;
    if(!t)
    {
        return;
    }

    if(!t.family)
    {
        return;
    }

    var components = t.family.components;
    if(components.includes(t.innerHTML))
    {
        return;
    }

    components.push(t.innerHTML);

    updateFamiliesModel();
}

function deleteComponentFromFamily(evt)
{
    const t = evt.target;
    if(!t)
    {
        return;
    }

    if(!t.family)
    {
        return;
    }

    if(!confirm(`Are you sure you want to delete the '${t.componentName}' component from this family?`))
    {
        return;
    }

    var components = t.family.components;
    components.splice(components.indexOf(t.componentName), 1);

    updateFamiliesModel();
}

function deleteFamily(evt)
{
    const t = evt.target;
    if(!t)
    {
        return;
    }

    if(!t.family)
    {
        return;
    }

    if(!confirm(`Are you sure you want to delete the '${t.name}' family?`))
    {
        return;
    }

    architecture.families.splice(architecture.components.indexOf(t.family), 1);
    updateComponentsModel();
}

function updateComponentsModel()
{
    const div = document.getElementById("components-list");
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

        $('input', $(compDiv)).each((_, t) =>  $(t).change(updateInput));
        $('select', $(compDiv)).each((_, t) =>  $(t).change(updateInput));

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

function updateFamiliesModel()
{
    const div = document.getElementById("families-list");
    while(div.hasChildNodes())
    {
        div.lastChild.remove();
    }

    for(const family of architecture.families)
    {
        const familyDiv = document.createElement("div");
        familyDiv.setAttribute("class", "component-div p-2");
        div.appendChild(familyDiv);

        const topRow = document.createElement("div");
        topRow.setAttribute("class", "row");
        familyDiv.appendChild(topRow);

        const input = document.createElement("input");
        input.setAttribute("class", "col family-name-text");
        input.setAttribute("type", "text");
        input.setAttribute("target", "family-name");
        input.family = family;
        input.value = family.name;
        topRow.appendChild(input);

        $('input', $(familyDiv)).each((_, t) =>  $(t).change(updateInput));

        for(const componentName of family.components)
        {
            const row = document.createElement("div");
            row.setAttribute("class", "row");
            familyDiv.appendChild(row);

            const label = document.createElement('label');
            label.innerHTML = componentName;
            label.setAttribute("class", "col");
            row.appendChild(label);

            const del = document.createElement("button");
            del.innerHTML = "X";
            del.setAttribute("class", "col-md-auto btn btn-warning");
            del.family = family;
            del.componentName = componentName;
            $(del).click(deleteComponentFromFamily);
            row.appendChild(del);
        }

        const bottomRow = document.createElement("div");
        bottomRow.setAttribute("class", "row");
        familyDiv.appendChild(bottomRow);

        const dropdown = document.createElement("div");
        dropdown.setAttribute("class", "dropdown");
        bottomRow.appendChild(dropdown);

        const add = document.createElement("button");
        add.setAttribute("class", "col btn-secondary btn");
        add.setAttribute("type", "button");
        add.setAttribute("id", `${family.name}dropdown`);
        add.setAttribute('data-toggle', 'dropdown');
        add.setAttribute("aria-haspopup", "true");
        add.setAttribute("aria-expanded", "false");
        add.innerHTML = "Add Component";
        dropdown.appendChild(add);

        const items = document.createElement("div");
        items.setAttribute("class", "dropdown-menu");
        items.setAttribute("aria-labelledby", `${family.name}dropdown`);
        dropdown.appendChild(items);

        for(const comp of architecture.components)
        {
            var a = document.createElement('button');
            a.setAttribute("class", "dropdown-item");
            a.setAttribute("type", "button");
            a.family = family;
            a.innerHTML = comp.name;
            $(a).click(addComponentToFamily);
            items.appendChild(a);
        }

        const del = document.createElement("button");
        del.setAttribute("class", "col-md-auto btn-danger btn");
        del.setAttribute("type", "button");
        del.family = family;
        $(del).click(deleteFamily);
        del.innerHTML = "X";
        topRow.appendChild(del);
    }

    save();
}

function save()
{
    var str = JSON.stringify(architecture, undefined, 2);
    localStorage.setItem(storageKey, str);
    $("#json-content").html(str);
}

document.getElementById("fullJsonExample").innerHTML = JSON.stringify(exampleArchitecture,  undefined, 2);
document.getElementById("fullYamlExample").innerHTML = `components:
- name: position
  properties:
  - name: x
    type: float
  - name: y
    type: float
- name: velocity
  properties:
  - name: x
    type: float
  - name: y
    type: float
- name: controller
  properties:
  - name: controllerType
    type: string
- name: texture
  properties:
  - name: textureFilePath
    type: string
families:
- name: movable
  components:
  - position
  - velocity
- name: drawable
  components:
  - position
  - texture
- name: controllable
  components:
  - velocity
  - controller
entities:
- name: player
  families:
  - movable
  - drawable
  - controlable
systems:
- name: movePlayer
  parameters:
  - movable
- name: drawPlayer
  parameters:
  - drawable
- name: controllerPlayer
  parameters:
  - controlable
`;