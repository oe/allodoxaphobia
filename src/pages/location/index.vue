<template>
<div class="location">
  <div class="xinput-cell">
    <input
      v-model="kwd"
      type="text"
      @confirm="onSearch"
      confirm-type="search"
      :placeholder="defaultKwd">
    <select :value="distance" :range="distanceRang" @change="onDisChange">
      <div>距离: {{distance}}</div>
    </select>
    <!-- <span class="btn" @tap="onSearch">GO</span> -->
  </div>
  <div class="result-list" v-if="result.length && status === 'done'">
    <div class="item"
      v-for="item in result"
      :key="item.uid"
      @tap="onTapItem(item)">
      <h4 class="title">{{item.name}}</h4>
      <p class="desc">{{item.address}}</p>
      <p class="spec">🏷{{item.detail_info.tag}}  ☎️{{item.telephone}}  ¥{{item.detail_info.price}}</p>
    </div>
  </div>
  <div v-else class="info-tip">
    <div v-if="status === 'done'">
      你要找的地方估计在火星吧😢
    </div>
    <div v-else-if="status === 'pending'">
      正在扫描周边位置, 请稍候...
    </div>
    <div v-else>
      扫描失败😱, 可能网络故障中...
    </div>
  </div>
  <div v-show="result.length && status === 'done'"
    class="pick-btn"
    @tap="onPick"
  >选一个</div>
</div>
</template>

<script>
import utils from '@/utils/index'

export default {
  data () {
    return {
      kwd: '',
      lastPair: null,
      defaultKwd: '美食',
      distance: '1KM',
      distanceRang: ['1KM', '2KM', '3KM', '5KM', '10KM', '20KM'],
      status: 'pending',
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
    },
    onSearch () {
      this.getNearby(this.kwd, this.distance)
    },
    onPick () {
      const idx = Math.floor(Math.random() * this.result.length)
      this.result = [this.result[idx]]
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
      const curPair = `${kwd}|${distance}`
      if (this.lastPair === curPair) return
      this.status = 'pending'
      wx.showNavigationBarLoading()
      try {
        const location = await this.getLocation()
        const result = await utils.getNearbyLocations({
          query: kwd,
          radius: distance,
          location
        })
        // console.log('result', result)
        this.result = result
        this.lastPair = curPair
        this.status = 'done'
      } catch (e) {
        this.status = 'failed'
        console.log('failed to get nearby', e)
      }
      wx.hideNavigationBarLoading()
    }
  }
}
</script>

<style lang="scss">
.location {
  position: relative;

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

  .info-tip {
    color: #777;
    text-align: center;
    font-size: 16px;
    font-weight: 200;
  }

  .pick-btn {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #32c24d;
    border-radius: 6px;
    text-align: center;
    color: #fff;
    padding: 4px 6px;
    font-weight: 100;
    font-size: 16px;
    opacity: .8;

    &:active {
      opacity: 1;
    }
  }
}
</style>
