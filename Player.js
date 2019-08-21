class Player {
    constructor(_name, _deaths, _playerKills, _longestShot, _zedKills, _timeSurvived, _distTraveled) {
        this.name = _name;
        this.deaths = _deaths;
        this.playerKills = _playerKills;
        this.longestShot = _longestShot;
        this.zedKills = _zedKills;
        this.timeSurvived = _timeSurvived;
        this.distTraveled = _distTraveled;
    }
}

module.exports = Player;
