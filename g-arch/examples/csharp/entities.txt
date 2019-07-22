namespace GArch_CSharp_Example
{
    public struct Player : IMovable, IDrawable, IControllable
    {
        public Controller controller;
        public Position position;
        public Texture texture;
        public Velocity velocity;

        public Player(Position position, Velocity velocity, Texture texture, Controller controller)
        {
            this.position = position;
            this.velocity = velocity;
            this.texture = texture;
            this.controller = controller;
        }

        public Controller Controller => controller;
        public Position Position => position;
        public Texture Texture => texture;
        public Velocity Velocity => velocity;
    }
}