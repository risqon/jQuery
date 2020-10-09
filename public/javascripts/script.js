const URL_API = `http://localhost:3000/users`


$(document).ready(() => {
    readData();


    $('.btn-edit').on('click', '.btn-chance', function (e) {
        const id = $('#editId').val();
        const string = $('#editString').val();
        const integer = $('#editInteger').val();
        const float = $('#editFloat').val();
        const date = $('#editDate').val();
        const boolean = $('#editBoolean').val();
        editData(id, string, integer, float, date, boolean);
    })

    $('.btn-add').on('click', '.btn-save', function (e) {
        const string = $('#addString').val();
        const integer = $('#addInteger').val();
        const float = $('#addFloat').val();
        const date = $('#addDate').val();
        const boolean = $('#addBoolean').val();
        addData(string, integer, float, date, boolean);

    })

    $("table tbody").on("click", ".btn-delete", function () {
        deleteData($(this).attr('dataid'));
    });

    $("table tbody").on("click", ".btn-edit", function () {
        dataModal($(this).attr('dataid'));
    });

    $('nav').on('click', 'li', function (e) {
        e.preventDefault();
        $('#page').val($(this).attr('pageid'));
        readData();
    })

    $('#searchForm').submit(function (e) {
        e.preventDefault();
        $('#page').val(1);
        readData();
    });

    $('#reset').on('click', function (e) {
        readData();
    })
})


const readData = () => {
    let page = $('#page').val();
    let id = $('#id').val();
    let integer = $('#integer').val();
    let string = $('#string').val();
    let float = $('#float').val();
    let startDate = $('#startDate').val();
    let endDate = $('#endDate').val();
    let boolean = $('#boolean').val();
    let checkId = $("input[type=checkbox][name=checkId]:checked").val();
    let checkInteger = $("input[type=checkbox][name=checkInteger]:checked").val();
    let checkString = $("input[type=checkbox][name=checkString]:checked").val();
    let checkFloat = $("input[type=checkbox][name=checkFloat]:checked").val();
    let checkDate = $("input[type=checkbox][name=checkDate]:checked").val();
    let checkBoolean = $("input[type=checkbox][name=checkBoolean]:checked").val();

    $.ajax({
        methdod: "GET",
        url: URL_API,
        data: { page, id, string, integer, float, startDate, endDate, boolean, checkId, checkString, checkFloat, checkInteger, checkDate, checkBoolean },
    }).done(result => {
        const data = result.data;
        let page = result.page;
        let pages = result.pages;
        let html = "";
        let pagination = "";
        console.log(`page:${page}, pages:${pages}`)
        data.forEach(item => {
            html += `<tr>
                    <td>${item.id}</td>
                    <td>${item.string}</td>
                    <td>${item.integer}</td>
                    <td>${item.float}</td>
                    <td>${moment(item.date).format('DD-MMMM-YYYY')}</td>
                    <td>${item.boolean}</td>
                    <td>
                      <button type="button" class="btn btn-success btn-edit" dataid="${item.id}" data-toggle="modal" data-target="#Edit"> Edit </button>
                      <button type="button" class="btn btn-danger btn-delete" dataid="${item.id}"> Delete </button>
                    </td>                  
                </tr>`
        });
        if (page == 1) {
            pagination += `<li class="page-item prevoius disabled" pageid="${page - 1}"><a class="page-link" href="#">Previous</a></li>\n`;
        } else {
            pagination += `<li class="page-item previous" pageid=${page - 1}><a class="page-link" href="#">Previous</a></li>\n`;
        }
        for (i = 1; i <= pages; i++) {
            if (i == page) {
                pagination += `<li class="page-item active" pageid="${i}"><a class="page-link" href="#">${i}</a></li>\n`;
            } else {
                pagination += `<li class="page-item" pageid="${i}"><a class="page-link" href="#">${i}</a></li>\n`;
            }
        }

        if (page == parseInt(pages)) {
            pagination += `<li class="page-item next disabled" pageid="${page + 1}"><a class="page-link" href="#">Next</a></li>\n`;
        } else {
            pagination += `<li class="page-item next" pageid=${page + 1}><a class="page-link" href="#">Next</a></li>\n`;
        }

        $("table tbody").html(html);
        $('nav ul').html(pagination);
    })
        .fail(function (err) {
            $("#notFoundModal").modal('show');
            console.log('Data yang diminta tidak ditemukan')
        });
}

const addData = (string, integer, float, date, boolean) => {
    $.ajax({
        method: "POST",
        url: URL_API,
        data: { string, integer, float, date, boolean }
    }).done(function (data) {
        readData()
    }).fail(function (jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
}


const deleteData = id => {
    $.ajax({
        method: "DELETE",
        url: `${URL_API}/${id}`,
        data: { id }
    }).done(() => {
        readData()
    }).fail((jqXHR, textStatus) => {
        alert("Request failed: " + textStatus);
    });
}

const editData = (id, string, integer, float, date, boolean) => {
    $.ajax({
        method: "PUT",
        url: `${URL_API}/${id}`,
        data: { string, integer, float, date, boolean },
    }).done(() => {
        readData();
    })
        .fail((err) => {
            console.log("Gagal Mengedit Data")
        });
}


const dataModal = (id) => {
    $.ajax({
        method: "GET",
        url: `${URL_API}/${id}`,
    }).done(function (data) {
        let html = ""
        data.forEach(item => {
            $('#editId').val(item.id);
            $('#editString').val(item.string);
            $('#editInteger').val(item.integer);
            $('#editFloat').val(item.float);
            $('#editDate').val(moment(item.date).format('YYYY-MM-DD'));
            if (item.boolean == true) {
                html += `<option value="true" selected>true</option>
                        <option value="false">false</option>`;
            } else {
                html += `<option value="false" selected>false</option>
                        <option value="true">true</option>`;
            };
            $('#editBoolean').html(html);
        });
    }).fail(function () {
        console.log('data belum masuk');
    });
}
