function capitalize(str)
{
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function* getEntities(architecture, component)
{
    for(const entity of architecture.entities)
    {
        for(const familyName of entity.families)
        {
            const family = architecture.families.find(f => f.name == familyName);
            if(!family){continue;}

            if(family.components.includes(component))
            {
                yield entity;
                break;
            }
        }
    }
}

function generateCSharp(architecture)
{
    if(architecture.systems.length === 0)
    {
        alert("Must have at least one system");
        return '';
    }
    if(architecture.entities.length === 0)
    {
        alert("Must have at least one entity");
        return '';
    }
    if(architecture.components.length === 0)
    {
        alert("Must have at least one component");
        return '';
    }
    if(architecture.families.length === 0)
    {
        alert("Must have at least one family");
        return '';
    }

    const lines = [];
    lines.push(`using System.Collections.Generic;
using System.Threading.Tasks;
    `);
    lines.push("namespace GArch_CSharp_Example");
    lines.push("{");
    
    // components
    for(const comp of architecture.components)
    {
        if(hasArray(comp))
        {
            lines.push(`public unsafe struct ${capitalize(comp.name)}`);
        }
        else
        {
            lines.push(`public struct ${capitalize(comp.name)}`);
        }
        lines.push("{");

        for(const prop of comp.properties)
        {
            if(prop.isArray === true)
            {
                lines.push(`public const int ${prop.name.toUpperCase()}_LENGTH = ${prop.length};`);
                lines.push(`public fixed char ${prop.name}[${prop.name.toUpperCase()}_LENGTH];`);
            }
            else
            {
                lines.push(`public ${prop.type} ${prop.name};`);
            }
        }
        lines.push("}");
    }

    //families
    for(const fam of architecture.families)
    {
        lines.push(`public interface I${capitalize(fam.name)}`);
        lines.push("{");
        for(const comp of fam.components)
        {
            lines.push(`${capitalize(comp)} ${capitalize(comp)} { get; }`);
        }
        lines.push("}");
    }

    // entities
    for(const entity of architecture.entities)
    {
        const interfaces = [];
        const components = new Set();
        for(const fam of entity.families)
        {
            interfaces.push(`I${capitalize(fam)}`);
            const family = architecture.families.find(f => f.name == fam);
            if(!family){continue;}

            for(const comp of family.components)
            {
                components.add(`public ${capitalize(comp)} ${comp};`);
                components.add(`public ${capitalize(comp)} ${capitalize(comp)} => ${comp};`);
            }
        }

        lines.push(`public struct ${capitalize(entity.name)} : ` + interfaces.join(", "));
        lines.push("{");
        lines.push([...components].join("\n"));
        lines.push("}");
    }

    //systems
    const modInit = [];
    const modDef = [];
    const mods = [];
    const interf = [];
    const modify = [];
    const reset = [];
    for(const system of architecture.systems)
    {
        interf.push(`void ${capitalize(system)}(IReadOnlyGameState gameState, GameStateModification gameStateModifier);`)
        modInit.push(`${system}Modification = new GameStateModification();`);
        modDef.push(`${system}Modification`);
        mods.push(`_impl.${capitalize(system)}(gameState, ${system}Modification)`);
        modify.push(`newGameState.AddModification(${system}Modification);`);
        reset.push(`${system}Modification.Reset();`);
    }

    lines.push('public interface ISystemManagerImpl');
    lines.push("{");
    lines.push(interf.join("\n"));
    lines.push("}");

    lines.push("public class SystemManager");
    lines.push("{");
    lines.push("private readonly ISystemManagerImpl _impl;");
    lines.push(`private readonly GameStateModification ${modDef.join(", ")};`);

    lines.push(`public SystemManager(ISystemManagerImpl impl)`);
    lines.push("{");
    lines.push("_impl = impl;");
    lines.push(modInit.join("\n"));
    lines.push("}");

    lines.push("public void Update(IReadOnlyGameState gameState, GameState newGameState)");
    lines.push("{");
    lines.push("Reset();");
    lines.push(mods.join(";\n") +";");
    lines.push("UpdateGameState(gameState, newGameState);");
    lines.push("}");

    lines.push("public async Task UpdateAsync(IReadOnlyGameState gameState, GameState newGameState)");
    lines.push("{");
    lines.push("Reset();");
    lines.push(`await Task.WhenAll(${mods.map(s => `Task.Run(() => ${s})`).join(",\n")});`);
    lines.push("UpdateGameState(gameState, newGameState);");
    lines.push("}");

    lines.push("private void UpdateGameState(IReadOnlyGameState oldGameState, GameState newGameState)");
    lines.push("{");
    lines.push("newGameState.Copy(oldGameState);");
    lines.push(modify.join("\n"));
    lines.push("}");

    lines.push("private void Reset()");
    lines.push("{");
    lines.push(reset.join("\n"));
    lines.push("}");

    lines.push("}");

    //misc
    lines.push("public interface IReadOnlyGameState");
    lines.push("{");
    lines.push("float Delta { get; }");
    lines.push("ulong Frame { get; }");
    const data = [];
    const sysData = [];
    for(const f of architecture.families)
    {
        lines.push(`IReadOnlyCollection<KeyValuePair<int, I${capitalize(f.name)}>> ${capitalize(f.name)}s { get; }`);
        data.push(`private readonly Dictionary<int, I${capitalize(f.name)}> ${f.name}s = new Dictionary<int, I${capitalize(f.name)}>();`)
        data.push(`public IReadOnlyCollection<KeyValuePair<int, I${capitalize(f.name)}>> ${capitalize(f.name)}s => ${f.name}s;`);
    }
    for(const e of architecture.entities)
    {
        lines.push(`IReadOnlyCollection<KeyValuePair<int, ${capitalize(e.name)}>> ${capitalize(e.name)}s { get; }`);
        data.push(`private readonly Dictionary<int, ${capitalize(e.name)}> ${e.name}s = new Dictionary<int, ${capitalize(e.name)}>();`);
        data.push(`public IReadOnlyCollection<KeyValuePair<int, ${capitalize(e.name)}>> ${capitalize(e.name)}s => ${e.name}s;`);
    }
    for(const s of architecture.systems)
    {
        lines.push(`int ${capitalize(s)}State { get; }`);
        sysData.push(`public int ${capitalize(s)}State { get; private set;}`);
    }
    lines.push("}");
    
    // Game State
    lines.push("public class GameState : IReadOnlyGameState");
    lines.push("{");
        lines.push("public float Delta { get; set;}");
        lines.push("public ulong Frame { get; set;}");
        lines.push(data.join("\n"));
        lines.push(sysData.join("\n"));

        lines.push("internal void AddModification(GameStateModification gameStateModification)");
        lines.push("{");
            for(const e of architecture.entities)
            {
                lines.push(`foreach(var ${e.name} in gameStateModification.${capitalize(e.name)}sToAdd)`);
                lines.push("{");
                lines.push(`Add${capitalize(e.name)}(${e.name});`);
                lines.push("}");

                lines.push(`foreach(var ${e.name} in gameStateModification.${capitalize(e.name)}sToRemove)`);
                lines.push("{");
                lines.push(`Remove${capitalize(e.name)}(${e.name});`);
                lines.push("}");
            }

            for(const c of architecture.components)
            {
                lines.push(`foreach(var pair in gameStateModification.${capitalize(c.name)}Changes)`);
                lines.push("{");
                for(const e of getEntities(architecture, c.name))
                {
                    lines.push(`if (${e.name}s.TryGetValue(pair.Key, out var ${e.name}))`);
                    lines.push("{");
                    lines.push(`${e.name}.${c.name} = pair.Value;`);
                    lines.push("break;");
                    lines.push("}");
                }
                lines.push("}");
            }
            for(const s of architecture.systems)
            {
                lines.push(`${capitalize(s)}State = gameStateModification.new${capitalize(s)}State;`);
            }
        lines.push("}");

        lines.push("internal void Copy(IReadOnlyGameState state)");
        lines.push("{");
        for(const fam of architecture.families)
        {
            lines.push(`${fam.name}s.Clear();`);
            lines.push(`foreach (var pair in state.${capitalize(fam.name)}s)`);
            lines.push("{");
            lines.push(`${fam.name}s.Add(pair.Key, pair.Value);`);
            lines.push("}");
        }
        for(const en of architecture.entities)
        {
            lines.push(`${en.name}s.Clear();`);
            lines.push(`foreach (var pair in state.${capitalize(en.name)}s)`);
            lines.push("{");
            lines.push(`${en.name}s.Add(pair.Key, pair.Value);`);
            lines.push("}");
        }
        lines.push("}");

        for(const e of architecture.entities)
        {
            const fams = [];
            const rFams = [];
            for(var f of e.families)
            {
                fams.push(`${f}s.Add(code, ${e.name});`);
                rFams.push(`${f}s.Remove(code);`)
            }
            lines.push(
`private void Add${capitalize(e.name)}(${capitalize(e.name)} ${e.name})
{
    var code = ${e.name}.GetHashCode();
    ${e.name}s.Add(code, ${e.name});
    ${fams.join("\n")}
}
private void Remove${capitalize(e.name)}(int code)
{
    ${e.name}s.Remove(code);
    ${rFams.join("\n")}
}
`)
        }
    lines.push("}");

    // GameStateModification
    lines.push("public class GameStateModification");
    lines.push("{");
        for(const e of architecture.entities)
        {
            lines.push(`private readonly List<${capitalize(e.name)}> ${e.name}sToAdd = new List<${capitalize(e.name)}>();`);
            lines.push(`private readonly List<int> ${e.name}sToRemove = new List<int>();`);
            lines.push(`public IEnumerable<${capitalize(e.name)}> ${capitalize(e.name)}sToAdd => ${e.name}sToAdd;`);
            lines.push(`public IEnumerable<int> ${capitalize(e.name)}sToRemove => ${e.name}sToRemove;`);
        }
        for(const c of architecture.components)
        {
            lines.push(`private readonly List<KeyValuePair<int, ${capitalize(c.name)}>> ${c.name}Changes = new List<KeyValuePair<int, ${capitalize(c.name)}>>();`);
            lines.push(`public IEnumerable<KeyValuePair<int, ${capitalize(c.name)}>> ${capitalize(c.name)}Changes => ${c.name}Changes;`);
        }
        const st = [];
        for(const s of architecture.systems)
        {
            st.push(`new${capitalize(s)}State`);
        }
        lines.push(`public int ${st.join(", ")};`);

        lines.push("internal void Reset()");
        lines.push("{");
        for(const e of architecture.entities)
        {
            lines.push(`${e.name}sToAdd.Clear();`);
            lines.push(`${e.name}sToRemove.Clear();`);
        }
        for(const c of architecture.components)
        {
            lines.push(`${c.name}Changes.Clear();`);
        }
        lines.push("}");

    lines.push("}");

    lines.push("}");
    return lines;
}