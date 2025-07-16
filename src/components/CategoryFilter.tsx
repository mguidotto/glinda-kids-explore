
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  count?: number; // Make count optional
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center gap-2 ${
            selectedCategory === category.id
              ? "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              : "hover:bg-orange-50 hover:border-orange-200"
          }`}
        >
          {category.name}
          {category.count !== undefined && (
            <Badge 
              variant="secondary" 
              className={`${
                selectedCategory === category.id 
                  ? "bg-white/20 text-white" 
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {category.count}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
