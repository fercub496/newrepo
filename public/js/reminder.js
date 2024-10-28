function toggleUpdateForm(reminderId) {
    const form = document.getElementById(`updateForm-${reminderId}`);
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
  }