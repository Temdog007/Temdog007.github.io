using System.Threading.Tasks;

namespace GArch_CSharp_Example
{
    public interface IAsyncSystemManagerImpl
    {
        Task ControlPlayer(IReadOnlyGameState gameState, GameStateModification gameStateModifier);

        Task DrawPlayer(IReadOnlyGameState gameState, GameStateModification gameStateModifier);

        Task MovePlayer(IReadOnlyGameState gameState, GameStateModification gameStateModifier);
    }

    public interface ISystemManagerImpl
    {
        void ControlPlayer(IReadOnlyGameState gameState, GameStateModification gameStateModifier);

        void DrawPlayer(IReadOnlyGameState gameState, GameStateModification gameStateModifier);

        void MovePlayer(IReadOnlyGameState gameState, GameStateModification gameStateModifier);
    }

    public class AsyncSystemManager
    {
        private readonly IAsyncSystemManagerImpl _impl;
        private readonly GameStateModification controlPlayerMod, movePlayerMod, drawPlayerMod;

        public AsyncSystemManager(IAsyncSystemManagerImpl impl)
        {
            _impl = impl;
            controlPlayerMod = new GameStateModification();
            movePlayerMod = new GameStateModification();
            drawPlayerMod = new GameStateModification();
        }

        public async Task Update(IReadOnlyGameState gameState, GameState newGameState)
        {
            controlPlayerMod.Reset();
            movePlayerMod.Reset();
            drawPlayerMod.Reset();

            await Task.WhenAll(
                _impl.ControlPlayer(gameState, controlPlayerMod),
                _impl.MovePlayer(gameState, movePlayerMod),
                _impl.DrawPlayer(gameState, drawPlayerMod)
            );

            newGameState.Modify(controlPlayerMod);
            newGameState.Modify(movePlayerMod);
            newGameState.Modify(drawPlayerMod);
        }
    }

    public class SystemManager
    {
        private readonly ISystemManagerImpl _impl;
        private readonly GameStateModification controlPlayerMod, movePlayerMod, drawPlayerMod;

        public SystemManager(ISystemManagerImpl impl)
        {
            _impl = impl;
            controlPlayerMod = new GameStateModification();
            movePlayerMod = new GameStateModification();
            drawPlayerMod = new GameStateModification();
        }

        public void Update(IReadOnlyGameState gameState, GameState newGameState)
        {
            controlPlayerMod.Reset();
            movePlayerMod.Reset();
            drawPlayerMod.Reset();

            _impl.ControlPlayer(gameState, controlPlayerMod);
            _impl.MovePlayer(gameState, movePlayerMod);
            _impl.DrawPlayer(gameState, drawPlayerMod);

            newGameState.Modify(controlPlayerMod);
            newGameState.Modify(movePlayerMod);
            newGameState.Modify(drawPlayerMod);
        }
    }
}