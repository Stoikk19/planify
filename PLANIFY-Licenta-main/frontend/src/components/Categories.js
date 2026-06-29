import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Categories.css';

const Categories = () => {
  const navigate = useNavigate(); // Ne ajută să schimbăm pagina
  const { t } = useTranslation(); // Pentru traducere

  // am adăugat proprietatea 'slug' ca să știm ce să cerem de la baza de date
  const categoriesData = [
    { id: 1, slug: 'coafor', name: t('category.coafor'), img: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80' },
    { id: 2, slug: 'frizerie', name: t('category.frizerie'), img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80' },
    { id: 3, slug: 'manichiura', name: t('category.unghii'), img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80' },
    { id: 4, slug: 'cosmetica', name: t('category.cosmetica'), img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80' },
    { id: 5, slug: 'masaj', name: t('category.masaj'), img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <section className="categories-section-mero">
      <h2 className="categories-title-mero">{t('categories.title')}</h2>
      <div className="categories-grid-mero">
        {categoriesData.map(cat => (
          <div key={cat.id} className="category-card-mero" onClick={() => navigate(`/categorie/${cat.slug}`)}>
            <img src={cat.img} alt={cat.name} />
            <h3>{cat.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;