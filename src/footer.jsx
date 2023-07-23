import CurrentTrack from "./currentTrack";
import PlayerControls from "./playerControls";

export default function Footer() {

    return (

    <div className="footer">
        <div className="currentTrackFooter">
            <CurrentTrack />
        </div>
        <div className="playerControlsFooter">
            <PlayerControls />
        </div>
    </div>
    )



}