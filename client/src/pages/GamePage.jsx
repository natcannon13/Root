import "./GamePage.css";

import Board from "../components/game/Board/Board";
import ActionMenu from "../components/game/ActionMenu/ActionMenu";
import PlayerInfo from "../components/game/PlayerPanel/PlayerInfo";
import GameInfo from "../components/game/GamePanel/GameInfo";
import ChatBox from "../components/game/Chat/ChatBox";

function GamePage() {
    return (
        <div className="game-page">

            {/* Main board */}
            <main className="board-area">
                <Board />
            </main>

            {/* Right sidebar */}
            <aside className="right-sidebar">
                <section className="action-area">
                    <ActionMenu />
                </section>

                <section className="chat-area">
                    <ChatBox />
                </section>
            </aside>

            {/* Bottom information bar */}
            <footer className="bottom-bar">

                <section className="game-info-area">
                    <GameInfo />
                </section>

                <section className="player-info-area">
                    <PlayerInfo />
                </section>

            </footer>

        </div>
    );
}

export default GamePage;