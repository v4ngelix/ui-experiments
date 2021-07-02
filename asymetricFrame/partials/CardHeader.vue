Vue.component('CardHeader', {
  /*
  data: function () {
    return {
      count: 0
    }
  },
  */
  props: ['establishment'],
  template: '
    <card-header>
      <h1>
        Food Menu
      </h1>
      <h2>
        {{establishment}}
      </h2>
    </card-header>
  '
});
