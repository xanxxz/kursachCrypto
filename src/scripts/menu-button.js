export function menuBtnsActive(btnMenu) {
	const currentPath = window.location.pathname;
  
	btnMenu.forEach((btn) => {
	  const buttonText = btn.textContent.trim().toLowerCase();

	  if (
		(buttonText.includes('markets') && currentPath.includes('market')) ||
		(buttonText.includes('create') && currentPath.includes('create')) ||
		(buttonText.includes('buy / sell') && currentPath.includes('not')) ||
		(buttonText.includes('business') && currentPath.includes('not')) ||
		(buttonText.includes('support') && currentPath.includes('not'))
	  ) {
		btn.classList.add('actived');
	  }

	  btn.addEventListener('click', () => {
		btnMenu.forEach((b) => b.classList.remove('actived'));
		btn.classList.add('actived');
	  });
	});
  }
  
