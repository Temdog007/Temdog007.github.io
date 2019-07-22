using System.Collections.Generic;

namespace GArch_CSharp_Example
{
    public enum SystemState : byte
    {
        Off,
        On
    }

    public interface IReadOnlyGameState
    {
        #region Data

        float Delta { get; }
        ulong Frame { get; }

        #endregion Data

        #region Families

        IReadOnlyCollection<KeyValuePair<int, IControllable>> Controllables { get; }
        IReadOnlyCollection<KeyValuePair<int, IDrawable>> Drawables { get; }
        IReadOnlyCollection<KeyValuePair<int, IMovable>> Movables { get; }
        IReadOnlyCollection<KeyValuePair<int, Player>> Players { get; }

        #endregion Families

        #region System States

        SystemState ControlPlayerState { get; }
        SystemState DrawPlayerState { get; }
        SystemState MovePlayerState { get; }

        #endregion System States
    }

    public class GameState : IReadOnlyGameState
    {
        #region Data

        private readonly Dictionary<int, IControllable> controllables = new Dictionary<int, IControllable>();
        private readonly Dictionary<int, IDrawable> drawables = new Dictionary<int, IDrawable>();
        private readonly Dictionary<int, IMovable> movables = new Dictionary<int, IMovable>();
        private readonly Dictionary<int, Player> players = new Dictionary<int, Player>();

        #endregion Data

        #region IReadOnlyGameState

        #region Data

        public float Delta { get; set; }

        public ulong Frame { get; set; }

        #endregion Data

        #region Families

        public IReadOnlyCollection<KeyValuePair<int, IControllable>> Controllables => controllables;
        public IReadOnlyCollection<KeyValuePair<int, IDrawable>> Drawables => drawables;

        public IReadOnlyCollection<KeyValuePair<int, IMovable>> Movables => movables;
        public IReadOnlyCollection<KeyValuePair<int, Player>> Players => players;

        #endregion Families

        #region System State
        public SystemState MovePlayerState { get; private set; }
        public SystemState DrawPlayerState { get; private set; }
        public SystemState ControlPlayerState { get; private set; }

        #endregion System State

        #endregion IReadOnlyGameState

        private void AddPlayer(Player player)
        {
            var code = player.GetHashCode();
            players.Add(code, player);
            movables.Add(code, player);
            drawables.Add(code, player);
            controllables.Add(code, player);
        }

        public void Modify(GameStateModification gameStateModification)
        {
            foreach (var player in gameStateModification.PlayersToAdd)
            {
                AddPlayer(player);
            }
            foreach (var playerToRemove in gameStateModification.PlayersToRemove)
            {
                RemovePlayer(playerToRemove);
            }
            foreach (var (index, position) in gameStateModification.PositionChanges)
            {
                if (players.TryGetValue(index, out var player))
                {
                    player.position = position;
                    break;
                }
            }
            MovePlayerState = gameStateModification.newMovePlayerState;
            DrawPlayerState = gameStateModification.newDrawPlayerState;
            ControlPlayerState = gameStateModification.newControlPlayerState;
        }

        private void RemovePlayer(int code)
        {
            players.Remove(code);
            movables.Remove(code);
            drawables.Remove(code);
            controllables.Remove(code);
        }
    }

    public class GameStateModification
    {
        #region Entity Changes

        private readonly List<Player> playersToAdd = new List<Player>();
        private readonly List<int> playersToRemove = new List<int>();

        public IEnumerable<Player> PlayersToAdd => playersToAdd;
        public IEnumerable<int> PlayersToRemove => playersToRemove;

        #endregion Entity Changes

        #region Component Changes

        private readonly List<KeyValuePair<int, Controller>> controllerChanges = new List<KeyValuePair<int, Controller>>();

        private readonly List<KeyValuePair<int, Position>> positionChanges = new List<KeyValuePair<int, Position>>();

        private readonly List<KeyValuePair<int, Texture>> textureChanges = new List<KeyValuePair<int, Texture>>();

        private readonly List<KeyValuePair<int, Velocity>> velocityChanges = new List<KeyValuePair<int, Velocity>>();

        public IEnumerable<KeyValuePair<int, Controller>> ControllerChanges => controllerChanges;
        public IEnumerable<KeyValuePair<int, Position>> PositionChanges => positionChanges;
        public IEnumerable<KeyValuePair<int, Texture>> TextureChanges => textureChanges;
        public IEnumerable<KeyValuePair<int, Velocity>> VelocityChanges => velocityChanges;

        #endregion Component Changes

        public SystemState newMovePlayerState, newDrawPlayerState, newControlPlayerState;

        internal void Reset()
        {
            playersToAdd.Clear();
            playersToRemove.Clear();

            controllerChanges.Clear();
            positionChanges.Clear();
            textureChanges.Clear();
            velocityChanges.Clear();
        }
    }

    internal static class Extensions
    {
        public static void Deconstruct<T1, T2>(this KeyValuePair<T1, T2> pair, out T1 key, out T2 value)
        {
            key = pair.Key;
            value = pair.Value;
        }
    }
}