import "./GamePage.css";

import Board from "../components/game/Board";
import ActionMenu from "../components/game/ActionMenu";
import PlayerInfo from "../components/game/PlayerInfo";
import GameInfo from "../components/game/GameInfo";
import ChatBox from "../components/ChatBox";

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