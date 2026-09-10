<?php
namespace App\Http\Requests\Gallery;
use Illuminate\Foundation\Http\FormRequest;
class StoreGalleryItemRequest extends FormRequest {
 public function authorize(): bool { return $this->user()?->canEdit() ?? false; }
 public function rules(): array { return [
  'file'=>['nullable','file','mimes:jpg,jpeg,png,webp,gif','max:10240'],
  'file_url'=>['nullable','url','max:500','required_without:file'],
  'thumbnail_url'=>['nullable','url','max:500'],'type'=>['sometimes','in:photo,video'],
  'caption'=>['nullable','string','max:255'],'cloudinary_public_id'=>['nullable','string','max:255'],'sort_order'=>['sometimes','integer'],
 ]; }
}
