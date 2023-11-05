function skillsMember() {
  var skills = document.getElementById("skills");
  var skillsMember = document.getElementById("skillsMember");
  var skillsMemberValue = skillsMember.value;
  var skillsMemberText = skillsMember.options[skillsMember.selectedIndex].text;
  var skillsMemberTextValue = skillsMemberText + " " + skillsMemberValue + " ";
  skills.value += skillsMemberTextValue;
  skillsMember.value = "";
}