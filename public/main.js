const form = document.getElementById('vote-form');


//form Submit Event
form.addEventListener('submit', (e) => {
    const choice = document.querySelector('input[name=crypto]:checked').value;
    const data = {crypto: choice};
    
    fetch('http://localhost:3000/poll', {
        method: 'post',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));
    e.preventDefault();
});

fetch('http://localhost:3000/poll')
.then(res => res.json())
.then(data => {
    const votes = data.votes;
    const totalVotes = votes.length;

    //count the vote points for each selection - acc & current value
    const voteCounts = votes.reduce(
            (acc, vote) => (
                (acc[vote.crypto] = (acc[vote.crypto] || 0) + parseInt(vote.points)), acc), {});

    //Canvas JS
let dataPoints = [
    { label: 'bitcoin', y: voteCounts.bitcoin },
    { label: 'ethereum', y: voteCounts.ethereum },
    { label: 'litecoin', y: voteCounts.litecoin },
    { label: 'nothing', y: voteCounts.nothing }
];

const chartContainer = document.querySelector('#chartContainer');

if(chartContainer){
    const chart = new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        theme: 'theme1',
        title: {
            text: `${totalVotes} votes so far...`
        },
        data: [
            {
                type: 'column',
                dataPoints: dataPoints
            }
        ]
    });
    chart.render();

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var pusher = new Pusher('ca9608fb609a707707ec', {
      cluster: 'us2',
      forceTLS: true
    });

    var channel = pusher.subscribe('crypto-poll');
    channel.bind('crypto-vote', function(data) {
      dataPoints = dataPoints.map(x => {
        console.log(data.points);  
        if(x.label == data.crypto) { 
              x.y += data.points;
              return x;
          } else {
              return x;
          }
      });
      chart.render();
    });
}


});
