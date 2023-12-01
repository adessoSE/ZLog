import moment from 'moment';

/**
 * translates solr rows into internal object used for the result table, data needed in other components
 * @param {*} data solr response
 */
export function prepareDataForResultList(data) {
  let solr_data = data['docs'];
  solr_data.forEach((task) => {
    let time = Array.isArray(task.time) ? task.time[0] : task.time;
    // console.log(moment(time, "ddd MMM dd yyyy HH:mm:ss").format('DD.MM.YYYY HH:mm:ss.SSS'));
    task.time = moment(time).local().format('DD.MM.YYYY HH:mm:ss.SSS');

    // eslint-disable-next-line no-unused-vars
    for (const [key, value] of Object.entries(task)) {
      if (Array.isArray(value)) {
        task[key] = value.join(', ');
      }
    }
  });

  return solr_data;
}
