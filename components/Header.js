// Header component
import React from 'react';

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/tienda">Tienda</a></li>
          <li><a href="/productos">Productos</a></li>
          <li><a href="/nosotros">Nosotros</a></li>
          <li><a href="/contacto">Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;