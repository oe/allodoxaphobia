<template>
<div class="location">
  <div class="xinput-cell">
    <input v-model="kwd" type="text" :placeholder="defaultKwd">
    <select :value="distance" :range="distanceRang" @change="onDisChange">
      <div>距离: {{distance}}</div>
    </select>
    <span class="btn" @tap="onSearch">GO</span>
  </div>
  <div class="result-list">
    <div class="item"
      v-for="item in result"
      :key="item.uid"
      @tap="onTapItem(item)">
      <h4 class="title">{{item.name}}</h4>
      <p class="desc">{{item.address}}</p>
      <p class="spec">🏷{{item.detail_info.tag}}  ☎️{{item.telephone}}  ¥{{item.detail_info.price}}</p>
    </div>
    <div class="item"></div>
  </div>
</div>
</template>

<script>
import utils from '@/utils/index'

export default {
  data () {
    return {
      kwd: '',
      lastKwd: null,
      defaultKwd: '美食',
      distance: '1KM',
      distanceRang: ['1KM', '2KM', '3KM', '5KM', '10KM', '20KM'],
      result: [],
      location: null
    }
  },
  created () {
    this.getLocation()
  },
  mounted () {
    this.getNearby(this.kwd)
  },
  methods: {
    onDisChange (e) {
      this.distance = this.distanceRang[e.target.value]
    },
    onTapItem (item) {
      // let info
      // if ((info = item.detail_info.detail_url)) {
      //   const url = `../webview/webview?url=${encodeURIComponent(info)}`
      //   console.log('url', url)
      //   wx.navigateTo({url})
      // } else {
      wx.openLocation({
        latitude: item.location.lat,
        longitude: item.location.lng,
        name: item.name,
        address: item.address
      })
      // }
      // console.log('on click', item)
    },
    onSearch () {
      this.getNearby(this.kwd, this.distance)
    },
    getLocation (force) {
      if (this.location && !force) return Promise.resolve(this.location)
      return new Promise((resolve, reject) => {
        wx.getLocation({
          type: 'gcj02',
          success: (res) => {
            this.location = res
            resolve(res)
          },
          fail: reject
        })

      })
    },
    async getNearby (kwd, distance) {
      kwd = kwd || this.defaultKwd
      distance = parseInt(distance, 10) * 1000
      if (this.lastKwd === kwd) return
      try {
        const location = await this.getLocation()
        const result = await utils.getNearbyLocations({
          query: kwd,
          radius: distance,
          location
        })
        console.log('result', result)
        this.result = result
        this.lastKwd = kwd
      } catch (e) {
        console.log('failed to get nearby', e)
      }
    }
  }
}
</script>

<style lang="scss">
.location {
  .xinput-cell {
    width: 90%;
    max-width: 300px;
    margin: 10px auto;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: 100;

    input {
      padding: 4px 8px;
    }

    select {
      text-align: center;
      width: 200px;
      color: #999;
    }

    span {
      text-align: center;
      display: block;
      width: 100px;
      background-color: #32c24d;
    }
  }

  .result-list {
    padding-left: 10px;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    font-weight: 200;

    .item {
      padding: 8px 10px;
      & + .item {
        border-top: 1px solid whitesmoke;
      }

      .desc {
        font-size: 14px;
        color: #777;
      }

      .spec {
        font-size: 10px;
        color: #aaa;
      }
    }
  }
}
</style>
