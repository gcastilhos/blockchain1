"use strict";

var mockEventData = "Date|Time|EventID|Appl.ID |ActivePWR |ReactivePwr|Voltage|Intensity |HASH\u003e\u003e\u003e 10Mar2015 0:00:00 1201210 9b75a5178a 2.58 0.136 241.97 10.6\u003e\u003e\u003e 10Mar2015 0:01:00 1201211 9b75a5178f 2.552 0.1 241.75 10.4\u003e\u003e\u003e 10Mar2015 0:02:00 1201212 9b75a51791 2.55 0.1 241.64 10.4\u003e\u003e\u003e 10Mar2015 0:03:00 1201213 9b75a5178d 2.55 0.1 241.71 10.4\u003e\u003e\u003e 10Mar2015 0:04:00 1201214 9b75a5178b 2.554 0.1 241.98 10.4\u003e\u003e\u003e 10Mar2015 0:05:00 1201215 9b75a5178f 2.55 0.1 241.83 10.4\u003e\u003e\u003e 10Mar2015 0:06:00 1201216 9b75a51790 2.534 0.09 241.07 10.4\u003e\u003e\u003e 10Mar2015 0:07:00 1201217 9b75a51791 2.484 0.21 241.29 10.2\u003e\u003e\u003e 10Mar2015 0:08:00 1201218 9b75a5178a 2.468 0.32 241.23 10.2\u003e\u003e\u003e 10Mar2015 0:09:00 1201219 9b75a51793 2.48 0.54 242.28 10.2";

(function() {

    var _valid_hash = function(hash_code) {
        if (hash_code != undefined) {
            return hash_code.startsWith("000");
        }
        return false;
    };

    var _encode = function(id) {
        var nonce = -1;
        var hash_code = undefined;
        while (!_valid_hash(hash_code)) {
            nonce++;
            var text_to_encode = app.previous_hash[id] + app.eventData[id] + nonce;
            hash_code = sha256(text_to_encode);
        }
        return {"nonce": nonce, "hash": hash_code};
    };
  
    var router = new VueRouter({
        mode: 'history',
        routes: []
    });

    var app = new Vue({
        router,
        el:'#app',
        data: {
            block_no: 432,
            hash: new Array(6).fill(''),
            original_hash: new Array(6).fill(''),
            previous_hash: ["0005100308e7e0bea95a3e88e4e406c37133f0929c80866bda04bc0bce53a14", '', '', '', '', ''],
            nonce: new Array(6).fill(''),
            eventData: new Array(6).fill(mockEventData),
            active: new Array(6).fill(false),
            blocks: 1,
            rows: 1
        },
        methods: {
            getHash: function(id) {
                var data = _encode(id);
                this.$set(this.nonce, id, data.nonce);
                this.$set(this.hash, id, data.hash);
                if (this.original_hash[id] === '') {
                    this.$set(this.original_hash, id, this.hash[id]);
                } else {
                    this.$set(this.active, id, (this.original_hash[id] != this.hash[id]));
                }
                if (id < this.blocks - 1) {
                    this.$set(this.previous_hash, id + 1, this.hash[id]);
                    this.getHash(id + 1);
                }
            },
            numCols: function(rows) {
                if (2 * rows > this.blocks) {
                    return 1;
                }
                return 2;
            },
            getIndex: function(row, column) {
                return 2 * row + column - 3; 
            }
        },
        filters: {
            blockNoFormat: function(num) {
                return ("000" + num).slice(-6);
            }
        },
        mounted: function() {
            this.blocks = this.$route.query.blocks !== undefined ? Math.min(this.$route.query.blocks, 6) : 1;
            this.rows = Math.ceil(this.blocks / 2); 
        }
    });

    app.getHash(0);
})();
