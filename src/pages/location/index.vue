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
      <div>距离: {{distanceRang[distance]}}</div>
    </select>
    <!-- <span class="btn" @tap="onSearch">GO</span> -->
  </div>
  <div class="result-list" v-if="selected.length && status === 'done'">
    <div class="item"
      v-for="item in selected"
      :key="item.uid"
      @tap="onTapItem(item)">
      <h4 class="title">{{item.name}}</h4>
      <p class="desc">{{item.address}}</p>
      <p class="spec">
        <span v-if="item.detail_info.tag">🏷{{item.detail_info.tag}}</span>
        <span v-if="item.telephone">☎️{{item.telephone}}</span>
        <span v-if="item.detail_info.price">¥{{item.detail_info.price}}</span>
      </p>
    </div>
  </div>
  <div v-else class="info-tip">
    {{statusTip}}
  </div>
  <div v-show="selected.length && status === 'done'"
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
      distance: 0,
      selected: [],
      distanceRang: ['1KM', '2KM', '3KM', '5KM', '10KM', '20KM'],
      statusTip: '',
      status: 'pending',
      result: [],
      location: null
    }
  },
  // created () {
  //   this.getLocation()
  // },
  mounted () {
    this.getNearby(this.kwd)
  },
  methods: {
    onDisChange (e) {
      this.distance = e.target.value
      this.onSearch()
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
      this.selected = [this.result[idx]]
    },
    getLocation (force) {
      if (this.location && !force) return Promise.resolve(this.location)
      this.status = 'pending'
      this.statusTip = '正在获取你的当前坐标...'
      return new Promise((resolve, reject) => {
        wx.getLocation({
          type: 'gcj02',
          success: (res) => {
            res.lat = res.latitude
            res.lng = res.longitude
            this.location = res
            this.statusTip = '坐标获取成功😏'
            resolve(res)
          },
          fail: (err) => {
            this.statusTip = '坐标获取失败😭, 麻烦先授权小程序获取地理位置🙏🏻'
            err.isLocation = true
            reject(err)
          }
        })

      })
    },
    async getNearby (kwd, distance) {
      kwd = kwd || this.defaultKwd
      distance = this.distanceRang[distance]
      distance = parseInt(distance, 10) * 1000
      const curPair = `${kwd}|${distance}`
      if (this.lastPair === curPair) return
      wx.showNavigationBarLoading()
      try {
        const location = await this.getLocation()
        this.status = 'pending'
        this.statusTip = '正在扫描周边位置...'
        const result = await utils.getNearbyLocations({
          query: kwd,
          radius: distance,
          location
        })
        // console.log('result', result)
        this.result = result
        this.selected = result
        this.lastPair = curPair
        this.status = 'done'
        this.statusTip = result.length ? '获取成功' : '你要找的地方估计在火星吧😢'
      } catch (e) {
        this.status = 'failed'
        if (!err.isLocation) {
          this.statusTip = '扫描失败😱, 可能网络故障中...'
        }
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
      width: 120px;
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

        span {
          margin-right: 6px;
        }
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
    width: 50px;
    height: 50px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #32c24d;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    padding: 4px 6px;
    font-weight: 100;
    line-height: 50px;
    font-size: 14px;
    opacity: .9;

    &:active {
      opacity: 1;
    }
  }
}
</style>
