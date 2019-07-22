namespace GArch_CSharp_Example
{
    public interface IControllable
    {
        Controller Controller { get; }
        Velocity Velocity { get; }
    }

    public interface IDrawable
    {
        Position Position { get; }
        Texture Texture { get; }
    }

    public interface IMovable
    {
        Position Position { get; }
        Velocity Velocity { get; }
    }
}