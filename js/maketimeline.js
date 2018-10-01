
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

  var resizeTimeline = function() {
      //dummy function, will be initialized below

    };

    var groups = [{
        id: 1,
        content: 'FLOSS',
        className: 'floss-bg'
        // Optional: a field 'className', 'style', 'order', [properties]
      },
      {
        id: 2,
        content: 'Geoinformation',
        className: 'geoinf-bg'
        // Optional: a field 'className', 'style', 'order', [properties]
      },
      {
        id: 3,
        content: 'Open Data /<br>Open X',
        className: 'openX-bg'
        // Optional: a field 'className', 'style', 'order', [properties]
      },
      {
        id: 4,
        content: 'Open Government',
        className: 'opengov-bg'
        // Optional: a field 'className', 'style', 'order', [properties]
      }
    ];


//  $('#legend').append(legend_entry);
    for (let index = 0; index < groups.length; index++) {
      const group = groups[index];
      var coloredbox = $('<div valign="bottom" class="coloredbox" width="10">&nbsp;</div>');
      coloredbox.addClass(group["className"]);
     // $('#legend').append(coloredbox);
      var legend_entry = $('<div style="float: left;"></div>');
      legend_entry.append(coloredbox);
      legend_entry.append(group["content"]);
      $('#legend').append(legend_entry);
      //legend_entry.
    }

    function arrayToTable(tableData) {
      var table = $('<table id="timeline_table" class="display" width="95%" padding="0" style="padding-left:0pt;"></table>');

      table.append("<thead> <tr>" +
        "<th>Datum</th>" +
        "<th>Ereignis</th>" +
        "<th>Beschreibung</th>" +
        "</tr>" +
        "</thead>");
      var tbody = $("<tbody></tbody");

      $(tableData).each(function(i, rowData) {
        if (i == 0 || rowData.length <= 1) return;

        var row = $('<tr></tr>');

        $([3, 1, 2]).each(function(j, index) {

          if(typeof file_base !== 'undefined' & rowData[index].includes("src=")){
              rowData[index] = rowData[index].replaceAll("src=","src="+file_base);
          };

          row.append($('<td>' + rowData[index] + '</td>'));
          //  $(row).css({"background-color":"red"});
        });
          $(row).addClass(groups[rowData[5]-1]["className"]);
          //groups[rowData[5]-1]["className"]
        tbody.append(row);
      });
      table.append(tbody);
      return table;
    }

    var dt_german = "DataTables/lang/German.json";

    if(typeof file_base !== 'undefined'){
      dt_german = file_base + dt_german;
    }

    console.log(dt_german);

    $.ajax({
      type: "GET",
      url: data_ref,
      success: function(data) {
        //   console.log(data)
        $('#table-view').append(arrayToTable(Papa.parse(data).data));

        $(document).ready(function() {
          $('#timeline_table').DataTable({
            paging: true,
            responsive:false,
            language: {
              url: dt_german
            }, "columns": [
              { "width": "5%" },
              { "width": "25%", "orderable": false },
              { "width": "70%" ,"orderable": false },
            ],
            "order": [[ 0, "desc" ]]
          });

        });

        var container = document.getElementById('visualization');
        var parsed = Papa.parse(data).data;

        var timelinedata = new Array();
        $(parsed).each(function(i, rowData) {
          //timelinedata.push({id: i, content:"test","start": 2000+i+"-01-01"});
          // var row = $('<tr></tr>');
          if (i == 0 || rowData.length <= 1) return;

          timelinedata[i - 1] = {};
          $(rowData).each(function(j, cellData) {
            if(typeof file_base !== 'undefined' & cellData.includes("src=")){
                  cellData = cellData.replaceAll("src=","src="+file_base);
            };
              

            // row.append($('<td>'+cellData+'</td>'));
            if (cellData == "")
              return;
            if (j == 1)
              //       cellData = "<button class='collapsible'>"+cellData+"</button>"+
              //       "<div class='content'> <p>Lorem ipsum...</p></div";
              cellData = "<div>" + cellData + "</div>" +
              "<div class='content'> <p>" + rowData[2] + "</p></div";
            timelinedata[i - 1][parsed[0][j]] = cellData;
          });
          //table.append(row);
        });


        console.log(timelinedata)

        // Create a DataSet (allows two way data-binding)
        var items = new vis.DataSet(timelinedata);


        // Configuration for the Timeline
        var options = {
          clickToUse: true,
          zoomMax: 1000 * 365 * 24 * 60 * 60 * 60,
          zoomMin: 100 * 365 * 24 * 60 * 60 * 60,
          orientation: "both",
          onInitialDrawComplete: function() {

            /*var coll = document.getElementsByClassName("collapsible");
            var i;
            alert(coll.length);

            for (i = 0; i < coll.length; i++) {
                coll[i].addEventListener("click", function() {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    console.log(content);
                    if (content.style.display === "block") {
                    content.style.display = "none";
                    } else {
                    content.style.display = "block";
                    }
                });
            }*/
            var coll = document.getElementsByClassName("vis-item-content");
            var i;

            for (i = 0; i < coll.length; i++) {
              coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.lastElementChild;
                console.log(content);
                if (content.style.display === "block") {
                  content.style.display = "none";
                } else {
                  content.style.display = "block";
                }
                resizeTimeline();
              });
            }




          }

        };

        // Create a Timeline
        var timeline = new vis.Timeline(container, items, groups, options);

        document.getElementById('window1').onclick = function() {
          timeline.setWindow('1983-01-01', '2000-01-01');
        };
        document.getElementById('window2').onclick = function() {
          timeline.setWindow('2000-01-01', '2010-01-01');
        };
        document.getElementById('window3').onclick = function() {
          timeline.setWindow('2010-01-01', '2018-09-01');
        };
        document.getElementById('fit').onclick = function() {
          timeline.fit();
        };

        resizeTimeline = function() {
          // var selection = timeline.getSelection();
          //timeline.focus(selection);
          timeline.redraw();
        };


      }
    });
