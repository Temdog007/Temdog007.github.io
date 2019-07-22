namespace GArch_CSharp_Example
{
    public unsafe struct Controller
    {
        public const int CONTROLLER_TYPE_LENGTH = 64;
        public fixed char controllerType[CONTROLLER_TYPE_LENGTH];

        public Controller(string controllerType)
        {
            unsafe
            {
                for (var i = 0; i < CONTROLLER_TYPE_LENGTH; ++i)
                {
                    if (i < controllerType.Length)
                    {
                        this.controllerType[i] = controllerType[i];
                    }
                    else
                    {
                        this.controllerType[i] = '\0';
                    }
                }
            }
        }
    }

    public struct Position
    {
        public float x;
        public float y;

        public Position(float x, float y)
        {
            this.x = x;
            this.y = y;
        }
    }

    public unsafe struct Texture
    {
        public const int TEXTURE_FILE_PATH_LENGTH = 64;
        public fixed char textureFilePath[TEXTURE_FILE_PATH_LENGTH];

        public Texture(string textureFilePath)
        {
            unsafe
            {
                for (var i = 0; i < TEXTURE_FILE_PATH_LENGTH; ++i)
                {
                    if (i < textureFilePath.Length)
                    {
                        this.textureFilePath[i] = textureFilePath[i];
                    }
                    else
                    {
                        this.textureFilePath[i] = '\0';
                    }
                }
            }
        }
    }

    public struct Velocity
    {
        public float x;
        public float y;

        public Velocity(float x, float y)
        {
            this.x = x;
            this.y = y;
        }
    }
}