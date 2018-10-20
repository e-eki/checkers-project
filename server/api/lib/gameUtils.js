

const gameUtils = new function() {

    this.getGameTimeNote = function(startTime, finishTime) {

        const gameTime = finishTime - startTime;

		const minute = 1000 * 60;
		const hour = minute * 60;
		const gameHours = Math.round(gameTime / hour);
		const gameMinutes = Math.round((gameTime - gameHours * hour) / minute);

		return (`${gameHours} ч ${gameMinutes} мин`);
    };

};

module.exports = gameUtils;