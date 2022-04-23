<template>
  <div style="width: 500px; text-align: left">
    <i-button @click="saveTabs" style="margin: 10px 0">保存窗口状态</i-button>
    <Collapse v-model="views" accordion>
      <Panel v-for="(group, index) of listOfGroup" :key="index">
        <Icon type="ios-close" @click="deleteGroup(index)"/> {{ group.name }}
        <Icon  style="float: right;margin-top: 5px " type="ios-settings" @click="changeGroupName(index, $event)" v-if="index !== currentEdit"/>
        <span v-if="index === currentEdit">
            <i-input style="width: 100px" v-model="gname" @click="stopEvent($event)"/><i-button @click="changeName(index, $event)">确认</i-button>
          </span>

        <div slot="content">
          <!--   一键恢复     -->
          <div v-for="item in group.list" >
            <img style="width: 20px; height:20px" :src="item.favIconUrl"/>
            <a target="_blank" :href="item.url" :key="item.url" >{{ item.title }}</a>
          </div>
        </div>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      listOfGroup: [],
      currentEdit: -1,
      gname: '',
      views: "1"
    }
  }
  ,
  mounted() {
    chrome.storage.sync.get('listOfGroup', (data) => {
      if (Array.isArray(data.listOfGroup))
        this.listOfGroup = data.listOfGroup;
    })
  },
  methods: {
    changeGroupName(index, e) {
      this.currentEdit = index;
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    // dochange
    changeName(index, e) {
      this.listOfGroup[index].name = this.gname;
      this.currentEdit = -1;
      this.gname = '';
      this.updateStorage();
      this.stopEvent(e);
      return false;
    },
    saveTabs() {
      chrome.tabs.query({}, (res) => {
        console.log(res);
        var group = {
          name: '新的群组',
          list: []
        }
        res.forEach(i => {
          let tab = {
            favIconUrl: i.favIconUrl,
            title: i.title,
            url: i.url
          }
          group.list.push(tab);
        })
        this.listOfGroup.push(group);
        this.updateStorage();
      });
    },

    deleteGroup(index) {
      this.listOfGroup.splice(index, 1);
      this.updateStorage();
    }
  ,
    stopEvent(e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    openWindow(href) {
      window.open(href);
    },
    updateStorage() {
      chrome.storage.sync.set({"listOfGroup": this.listOfGroup}, function () {
        console.log('The storage was updated.');
      });
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
