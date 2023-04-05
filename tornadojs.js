
$(document).ready(
	function ()
	{
		$("div#close_popup").click(close_popup);
	}
);


function close_popup ()
{
	$("div.popup").fadeOut();
}
