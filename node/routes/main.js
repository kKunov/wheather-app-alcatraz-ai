const Router = require('koa-router');
const router = Router();

const moment = require('moment');

const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

router.get('/currentWeather', async ctx => {
    let weather = await ctx.get('/weather?q=Sofia,BG&units=metric&APPID=' + openWeatherClientId, null).catch(err => {
        console.log(err);
    });

    weather.main.temp = Math.round(parseFloat(weather.main.temp));
    weather.main.temp_min = Math.round(parseFloat(weather.main.temp_min));
    weather.main.temp_max = Math.round(parseFloat(weather.main.temp_max));

    ctx.body = weather;
});

router.get('/forecastBy3Hours', async ctx => {
    let weather = await ctx.get('/forecast?q=Sofia,BG&units=metric&APPID=' + openWeatherClientId, null).catch(err => {
        console.log(err);
    });

    let days = [];

    weather.list.forEach(w => {
        let dt = moment(w.dt_txt, "YYYY-MM-DD HH:mm:ss");
        let dtPlus3H = moment(dt);
        dtPlus3H.add(3, 'h');

        let day = days.filter(d => d.name === daysOfWeek[dt.day()]);
        
        w.dtFromFormated = dt.format("HH") + "h";
        w.dtToFormated = dtPlus3H.format("HH") + "h";
        
        w.main.temp_min = Math.round(parseFloat(w.main.temp_min));
        w.main.temp_max = Math.round(parseFloat(w.main.temp_max));

        if (day.length > 0) {
            day = day[0];
            day.list.push(w);
        }
        else {
            days.push({
                list: [w],
                name: daysOfWeek[dt.day()],
                formated: daysOfWeek[dt.day()] + ", " + dt.format("Do MMM")
            });
        }
    });

    weather.list = days;

    ctx.body = weather;
});

module.exports = router;