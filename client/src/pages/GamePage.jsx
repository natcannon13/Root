import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useGameStore from "../state/gameStore";
import { getSession } from "../session/playerSession";
import { attemptRejoinFromRoute } from "../websocket/rejoin";

import "./GamePage.css";

import Board from "../components/game/Board";
import ActionMenu from "../components/game/ActionMenu";
import PlayerInfo from "../components/game/PlayerInfo";
import GameInfo from "../components/game/GameInfo";
import ChatBox from "../components/ChatBox";

function GamePage() {
    const navigate = useNavigate();
    const { lobbyId, seatIndex: seatIndexParam } = useParams();
    const seatIndexFromRoute = Number(seatIndexParam);

    const gameState = useGameStore((state) => state.gameState);
    const chatError = useGameStore((state) => state.chatError);

    useEffect(() => {
        attemptRejoinFromRoute();

        const timeout = setTimeout(() => {
            if (useGameStore.getState().gameState) return;
            const session = getSession(lobbyId, seatIndexFromRoute);
            if (!session?.playerName) {
                navigate(`/join/${lobbyId}/${seatIndexFromRoute}`);
            }
        }, 1500);

        return () => clearTimeout(timeout);
    }, [lobbyId, seatIndexFromRoute, navigate]);

    if (chatError) {
        return <div>Error: {chatError}</div>;
    }

    if (!gameState) {
        return <div>Loading game...</div>;
    }

    return (
        <div className="game-page">

            {/* Main board */}
            <main className="board-area">
                <Board />
            </main>

            {/* Right sidebar */}
            <aside className="right-sidebar">
                <section className="player-info-area">
                    <PlayerInfo />
                </section>
                <section className="game-info-area">
                    <GameInfo />
                </section>
                <section className = "bottom-sidebar">
                    <section className="action-area">
                        <ActionMenu />
                    </section>
                    <section className="chat-area">
                        <ChatBox />
                    </section>
                </section>
            </aside>

        </div>
    );
}

export default GamePage;
