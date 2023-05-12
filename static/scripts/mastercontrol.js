const  personalChats = document.getElementById('personalChats');
const profilePage = document.getElementById('profilePage');
const groupChats = document.getElementById('groupChats');
const personal = document.getElementById('personal');
const profile = document.getElementById('profile');
const group = document.getElementById('group');

personal.addEventListener('click', () => {
    personalChats.style.display = 'block';
    profilePage.style.display = 'none';
    groupChats.style.display = 'none';

});

profile.addEventListener('click', () => {
    personalChats.style.display = 'none';
    profilePage.style.display = 'block';
    groupChats.style.display = 'none';
})

group.addEventListener('click', () => {
    personalChats.style.display = 'none';
    profilePage.style.display = 'none';
    groupChats.style.display = 'block';
})
