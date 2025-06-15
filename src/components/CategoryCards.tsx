
import { Card, CardContent } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
}

interface CategoryCardsProps {
  categories: Category[];
  onCategorySelect: (categorySlug: string) => void;
}

const CategoryCards = ({ categories, onCategorySelect }: CategoryCardsProps) => {
  const getIcon = (iconName?: string) => {
    if (!iconName) return LucideIcons.Folder;
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Folder;
  };

  // Prendiamo solo le prime 4 categorie per il layout grid
  const displayCategories = categories.slice(0, 4);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {displayCategories.map((category) => {
        const IconComponent = getIcon(category.icon);
        
        return (
          <Card 
            key={category.id}
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white/90 backdrop-blur-sm border-2 hover:border-[#7BBCC7]"
            onClick={() => onCategorySelect(category.slug)}
          >
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <IconComponent 
                  className="h-12 w-12 mx-auto text-gray-600 group-hover:text-[#8B5A6B] transition-colors"
                  style={{ color: category.color || undefined }}
                />
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-[#8B5A6B] transition-colors">
                {category.name}
              </h3>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default CategoryCards;
