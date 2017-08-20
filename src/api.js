
import axios from 'axios'

let sets

export default {
  getSets (cb, force = false) {
    if (force || sets === undefined) {
      axios.get('http://motionbank.meso.net/deborah_hay/api/sets.json')
        .then((s) => {
          let publishedSets = s.data.filter((s) => s.published)
          publishedSets.sort((a, b) => a.title.localeCompare(b.title))
          sets = publishedSets || []
          cb(sets)
        })
        .catch((err) => { console.log('Err', err) })
    }
    else cb(sets)
  },
  getCellSet (setId, cb) {
    axios.get(`http://motionbank.meso.net/deborah_hay/api/sets/${setId}.json`)
      .then((cellSet) => {
        cb(cellSet.data)
      })
      .catch((err) => {
        console.log('Err', err)
      })
  }
}
