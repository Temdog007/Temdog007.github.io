function capitalize(str)
{
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateCSharp(architecture)
{
    const lines = [];
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
        modInit.push(`${system}Modification = new GameModification();`);
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
    lines.push("private readonly ISystemManageImpl _impl;");
    lines.push(`private readonly GameStateModification ${modDef.join(", ")};`);

    lines.push(`public SystemManager(ISystemManagerImpl impl)`);
    lines.push("{");
    lines.push("_impl = impl");
    lines.push(modInit.join("\n"));
    lines.push("}");

    lines.push("public void Update(IReadOnlyGameState gameState, GameState newGameState");
    lines.push("{");
    lines.push("Reset();");
    lines.push(mods.join(";\n") +";");
    lines.push("UpdateGameState(gameState, newGameState);");
    lines.push("}");

    lines.push("public async Task Update(IReadOnlyGameState gameState, GameState newGameState");
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

    lines.push("private void Reset");
    lines.push("{");
    lines.push(reset.join("\n"));
    lines.push("}");

    lines.push("}");

    return lines;
}