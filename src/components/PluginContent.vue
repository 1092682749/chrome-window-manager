<template>
  <div style="width: 500px; text-align: left">
    <i-button class="top-btn" @click="saveTabs(false)">保存窗口状态</i-button>
    <i-button class="top-btn"  @click="saveTabs(true)" >保存并关闭窗口</i-button>
    <Collapse v-model="views" accordion>
      <Panel v-for="(group, index) of listOfGroup" :key="index" style="position: relative">
        <Icon type="ios-close" @click="deleteGroup(index)"/> {{ group.name }}
        <span style="position: absolute;right: 5px ">
          <Icon   type="ios-settings" @click="changeGroupName(index, $event)" v-if="index !== currentEdit"/>

          <Icon   type="ios-redo" @click="discardChangeName($event)" v-if="index === currentEdit"/>
        </span>
        <span v-if="index === currentEdit">
          <span @click="stopEvent($event)"><i-input style="width: 100px" v-model="gname" @click="stopEvent($event)" @focus="stopEvent($event)"/></span>
            <i-button @click="changeName(index, $event)">确认</i-button>
          </span>

        <div slot="content">
          <!--   一键恢复     -->
          <Button type="text" @click="recover(group)">恢复所有窗口</Button><br/>
          <div v-for="item in group.list" :key="item">
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
  name: 'PluginContent',
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
    chrome.storage.local.get('listOfGroup', (data) => {
      if (Array.isArray(data.listOfGroup)) {
        this.listOfGroup = data.listOfGroup;
      }
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
    discardChangeName(e) {
      this.currentEdit = -1;
      this.gname = '';
      this.stopEvent(e);
      return false;
    },
    saveTabs(isCLose) {
      chrome.tabs.query({}, (res) => {
        console.log(res);
        let group = {
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
          // 判断是否需要关闭标签页
          if (isCLose) {
            this.closeTab(i.id, () => {});
          }
        })
        if (isCLose) {
          this.createTab('');
        }
        this.listOfGroup.push(group);
        this.updateStorage();
      });

    },
    closeTab(id, fun) {
      chrome.tabs.remove(id, fun);
    },
    deleteGroup(index) {
      this.listOfGroup.splice(index, 1);
      this.updateStorage();
    }
  ,
    stopEvent(e) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
    openWindow(href) {
      window.open(href);
    },
    updateStorage() {
      chrome.storage.local.set({"listOfGroup": this.listOfGroup}, function () {
        console.log('The storage was updated.');
      });
    },

    recover(group) {
      group.list.forEach( tab => {
        // chrome.tabs.create({url: tab.url});
        this.createTab(tab.url);
      })
    },
    createTab(url) {
      chrome.tabs.create({url});
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
.top-btn{
  margin: 10px 5px;
}
a {
  color: #42b983;
}

</style>
