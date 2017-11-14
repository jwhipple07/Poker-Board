$(document).ready(function () {


    //add a new row to Cards
    $("#addANewCard").on('click', function (e) {
        e.preventDefault();
        var cloned = $("#cards_0_").closest("tr").clone(true);
        var totalCards = $(".card-count").length;

        $(cloned).find("input").attr("id", "cards_" + totalCards + "_");
        $(cloned).find("input").attr("name", "cards[" + totalCards + "]");
        $(cloned).find("input").attr("value", "");
        $(cloned).find("input").val("");
        $(cloned).find("span").attr("data-valmsg-for", "cards[" + totalCards + "]");
        $(cloned).insertAfter(".card-count:last");
        return false;
    })



    //add a new row to Stories
    $("#addANewStory").on('click', function (e) {
        e.preventDefault();
        var cloned = $("#Stories_0__storyName").closest("tr").clone(true);
        var totalCards = $(".story-count").length;

        $(cloned).find("input").attr("id", "Stories_" + totalCards + "_");
        $(cloned).find("input").attr("name", "Stories[" + totalCards + "].storyName");
        $(cloned).find("input").attr("value", "");
        $(cloned).find("input").val("");
        $(cloned).find("span").attr("data-valmsg-for", "Stories[" + totalCards + "].storyName");
        $(cloned).insertAfter(".story-count:last");
        return false;
    })

})

/////////////CARD FUNCTIONS////////////////
function RemoveCardRow(item) {
    $(item).closest("tr").remove();
    RenumberCardRows();
}

function AddCardRow(item) {
    var itemRow = $(item).closest("tr");
    var cloned = $("#cards_0_").closest("tr").clone(true);

    $(cloned).find("input").attr("value", " ");
    $(cloned).insertBefore(itemRow);
    RenumberCardRows();
    return false;
    
}

function RenumberCardRows() {
    $("#cardTable .card-count").each(function (index, item) {

        $(item).find("input").attr("id", "cards_" + index + "__storyName");
        $(item).find("input").attr("name", "cards[" + index + "]");
        $(item).find("span").attr("data-valmsg-for", "cards[" + index + "]");
    })
}

///////////////////STORY FUNCTIONS/////////////
function RemoveStoryRow(item) {
    $(item).closest("tr").remove();
    RenumberStoryRows();
}

function AddStoryRow(item) {
    var itemRow = $(item).closest("tr");
    var cloned = $("#Stories_0__storyName").closest("tr").clone(true);

    $(cloned).find("input").attr("value", "");
    $(cloned).find("input").val("");
    $(cloned).insertBefore(itemRow);
    RenumberStoryRows();
    return false;

}

function RenumberStoryRows() {
    $("#storyTable .story-count").each(function (index, item) {

        $(item).find("input").attr("id", "Stories_" + index + "__storyName");
        $(item).find("input").attr("name", "Stories[" + index + "].storyName");
        $(item).find("span").attr("data-valmsg-for", "Stories[" + index + "].storyName");
    })
}