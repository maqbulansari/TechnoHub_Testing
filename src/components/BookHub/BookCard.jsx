import { Card } from "@/components/ui/card";

const BookCard = ({ book }) => {
  return (
    <Card className="group border-muted/60 hover:border-primary/40 transition">
      <div className="aspect-[3/4] overflow-hidden rounded-t-md bg-muted">
        <img
          src={book.image}
          alt={book.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 space-y-1">
        <h3 className="font-medium leading-tight">{book.title}</h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        <p className="text-sm text-muted-foreground line-clamp-2 pt-2">
          {book.description}
        </p>
      </div>
    </Card>
  );
};

export default BookCard;
