function Player({player, rowbombs,colbombs, side}) {

    return (
<div className="player-box" style={{ [side === "right" ? "right" : "left"]: side === "right" ? "-50px" : "200px" }}>
<div className="player-icon">
   {player === "Player" && <img className="hacker" src="/hacker.png" alt="" />}
                <img className="icon-img" src={player === "Player" ? `/person-tr.png` : `/robot-tr.png`} alt="" />
                <span style={{marginLeft:"30px", whiteSpace:"nowrap"}}>{player} {player === "Player" ? "- X" : " - O"}</span>
            </div>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"column",marginTop:"60px"}}>
            <span className="row-col">
          ROW
          {rowbombs === 1 ? (
            <img className="rocket" src="/rocket-tr.png" alt="" />
          ) : (
            <img className="rocket" src="/disabled-rocket.png" alt="" />
          )}
        </span>
        <span className="row-col">
          COL
          {colbombs === 1 ? (
            <img className="rocket" src="/rocket-tr.png" alt="" />
          ) : (
            <img className="rocket" src="/disabled-rocket.png" alt="" />
          )}
        </span>            </div>

        </div>
    )
}

export default Player
